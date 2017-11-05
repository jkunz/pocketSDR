import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events, Nav } from 'ionic-angular';

import { StorageServiceProvider  } from '../../providers/storage-service/storage-service';
import { ApiServiceProvider  } from '../../providers/api-service/api-service';

import { CompanyLoginPage } from '../company-login/company-login';

declare var _satellite: any;

@IonicPage()
@Component({
  selector: 'page-company-select',
  templateUrl: 'company-select.html',
})
export class CompanySelectPage {
  companies : any;
  companiesNotShown : any;
  shownTutorials:any;
  companyLoginPage = CompanyLoginPage

  constructor(public navCtrl: NavController, public navParams: NavParams, public storageService: StorageServiceProvider, public storage:Storage, public events:Events, public nav:Nav,public alertCtrl: AlertController,public loadingCtrl : LoadingController,public apiService: ApiServiceProvider) {
    
    this.shownTutorials=this.storage.get("shownTutorials").then(result => {
      this.shownTutorials = result ? <Array<Object>> result : [];
      if(this.storageService.tutorial==true && !this.shownTutorials.includes("companySelect1")){
        _satellite.data.customVars["tutorial mode"]="Tutorial Mode"
        this.storageService.addToStorageArray("shownTutorials","companySelect1")
        this.showTutorial(1);
      }else if(this.storageService.tutorial==true && !this.shownTutorials.includes("companySelect2")){
        this.storageService.addToStorageArray("shownTutorials","companySelect2")
        _satellite.data.customVars["tutorial mode"]="Tutorial Mode"
        this.showTutorial(2);
      }
    });
  }

  showTutorial(number){
    console.log("showTutorial opened")
    if(number==1){
      this.showTut1()
    }else if(number==2){
      this.showTut2()
    }
  } 
  showTut1(){
    let tutorial
    tutorial = this.alertCtrl.create({
      title: "Tip",
      message: "Since pulling the RS list takes time, we only do it automatically once. If you want to refresh the RS list for a company, swipe left and tap the refresh button.",
      buttons: [
        {
          text: "Next",
          role: 'cancel',
          handler: () => {
            this.showTutorial(2)
          }
        },
        {
          text: "Close",
          role: 'cancel',
        }
      ]
    }); 
    tutorial.present();
    if(!_satellite.data.customVars["tutorial mode"]){
      _satellite.data.customVars["tutorial mode"]="Manually Opened"
    }
    _satellite.data.customVars["tutorial"]="Company Select: Refresh a Company"
    _satellite.track("tutorial");     
  }
  showTut2(){
    let tutorial
    tutorial = this.alertCtrl.create({
      title: "Tip",
      message: "This lists all companies you've added to this app on this device. You can delete a company by swiping left and tapping the delete button (you can always add it back later if needed).",
      buttons: [
          {
            text: "Next",
            role: 'cancel',
            handler: () => {
              this.showTutorial(1)
            }
          },
          {
            text: "Close",
            role: 'cancel',
          }
        ]
      }); 
    tutorial.present();
    if(!_satellite.data.customVars["tutorial mode"]){
      _satellite.data.customVars["tutorial mode"]="Manually Opened"
    }
    _satellite.data.customVars["tutorial"]="Company Select: Delete a Company"
    _satellite.track("tutorial");      
  }

  goToRsSelect(company){
    this.storageService.currentCompany=company
    
    this.storageService.addToStorageSimple("currentCompany",company)
    this.events.publish('showPage:RSList', true);
    this.navCtrl.parent.select(1); //parent is the tabs page; it's the second in the array ("1" in javascript terms)
}

  goToCompanyLogin(){
    this.navCtrl.push("CompanyLoginPage")
  }

  refreshCompany(company,slidingItem){
    const loading = this.loadingCtrl.create({
        content: 'Pulling info from the Adobe API, please wait...'
    });

    loading.present()

    let alert = this.alertCtrl.create({
      title: "Something went wrong",
      message: "We weren't able to communicate with the API- please double check that you have connectivity and that your credentials are valid.",
      buttons: [
          {
              text: "Take me back",
              role: 'cancel',
          }
      ]
    });

    this.storage.get("companyData").then(result => {
      //get the companies current data to get its company, username and password; we only want to refresh/overwrite the report suites
      this.storageService.companyData=result
      _satellite.data.customVars["company"]=company
      _satellite.data.customVars["api type"]="company select:refresh"
      _satellite.track("api attempt")
      this.runApi(company,loading,alert)
    });
  }

  runApi(company,loading,alert){
    this.storageService.currentRS=""
    this.storageService.addToStorageSimple("currentRS","")    
    this.events.publish('showPage:RSList', false);
    this.storageService.currentVar=""
    this.storageService.addToStorageSimple("currentVar","")
    this.events.publish('showPage:varList', false);
    this.events.publish('showPage:varData', false);

    //set the username and secret for the API
    this.apiService.currentUsername=this.storageService.companyData[company].companyUsername
    this.apiService.currentSharedSecret=this.storageService.companyData[company].companySecret

    let params={}
    this.apiService.hitAPI('Company.GetReportSuites',params)              
            .subscribe(result => {
                let companyData={
                  companyName:company,
                  companyUsername:this.storageService.companyData[company].companyUsername,
                  companySecret:this.storageService.companyData[company].companySecret,
                  reportSuites:result.report_suites,
                  researchedSuites:[]
                }
                this.storageService.addToStorageComplex("companyData",company,companyData)

                loading.dismiss();
                _satellite.track("api success")
                this.goToRsSelect(company)

            }, error => {
              _satellite.data.customVars["api error"]=error
              _satellite.track("api error")
                loading.dismiss();
                console.log(error);
                alert.present();
            }); 
    }


    deleteItem(company,slidingItem) {
      let alert = this.alertCtrl.create({
          title: "Confirm Deletion",
          message: "Are you sure you want to permanently delete this company?",
          buttons: [
              {
                  text: "Cancel",
                  role: 'cancel',
                  handler: () => {
                    slidingItem.close();
                    console.log('cancel clicked');
                  }
              },
              {
                  text: "Yes",
                  handler: () => {
                    //first, remove it from the array of companies (localForage remove won't work because that removes the value of a key)
                    this.companies=this.storageService.companies;
                    var index=this.companies.indexOf(company)
                    this.companies.splice(index, 1);
                    this.storageService.addToStorageSimple("companies",this.companies)

                    //then, remove it from companyData
                    var localCompanyData=this.storageService.companyData
                    console.log("localCompanyData before: ", localCompanyData)
                    delete localCompanyData[company]
                    console.log("localCompanyData after: ", localCompanyData)
                    this.storageService.addToStorageSimple("companyData",localCompanyData)
                    _satellite.data.customVars["company"]=company
                    _satellite.track("delete")

                    //and from currentCompany if it IS the current company
                    if(this.storageService.currentCompany==company){
                      this.storageService.currentCompany=""
                      this.storageService.addToStorageSimple("currentCompany","")
                      this.storageService.currentRS=""
                      this.storageService.addToStorageSimple("currentRS","")    
                      this.events.publish('showPage:RSList', false);
                      this.storageService.currentVar=""
                      this.storageService.addToStorageSimple("currentVar","")
                      this.events.publish('showPage:varList', false);
                      this.events.publish('showPage:varData', false);
                    }
                  }
              }
          ]
      });
      alert.present();
  } 

  ionViewDidEnter() {

  }

  ionViewWillEnter() { 
    this.storage.get("currentCompany").then(result => this.storageService.currentCompany = result ? <Object> result : {});
    return this.storage.get("companies").then(result => {
      this.companies = result ? <Array<Object>> result : [];
      _satellite.data.customVars["number of companies"]=this.companies.length.toString();
      _satellite.data.customVars["page name"]="Company Select";
      _satellite.track("page view");;
      if(this.companies.length!=0){
        this.companiesNotShown=false;
      }else{
        this.companiesNotShown=true;
      }
    });
}

}
