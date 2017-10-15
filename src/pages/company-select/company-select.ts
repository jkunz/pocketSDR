import { Component } from '@angular/core';
import { NavController , AlertController, Events, LoadingController, Nav} from 'ionic-angular';
import { StorageService } from '../services/storage';
import { ApiService } from '../services/api';
import { HttpService } from '../services/http.service';
import { RsSelectPage } from '../rs-select/rs-select';
import { CompanyLoginPage } from '../company-login/company-login';

declare var require: any;
const localforage: LocalForage = require("localforage");

@Component({
  selector: 'page-company-select',
  templateUrl: 'company-select.html'
})

export class CompanySelectPage {
  companies : any;
  companiesNotShown : any;
  shownTutorials:any;
  companyLoginPage = CompanyLoginPage

    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public storageService : StorageService, public events:Events,  public apiService: ApiService, public loadingCtrl : LoadingController, public httpService: HttpService) {
      _satellite.setVar("page name","Company Select")
      _satellite.track("page view")
      this.shownTutorials=localforage.getItem("shownTutorials").then(result => {
        this.shownTutorials = result ? <Array<Object>> result : [];
        if(this.storageService.tutorial==true && !this.shownTutorials.includes("companySelect1")){
          this.storageService.addToStorageArray("shownTutorials","companySelect1")
          this.showTutorial(1)
        } 
        if(this.storageService.tutorial==true && !this.shownTutorials.includes("companySelect2")){
          this.storageService.addToStorageArray("shownTutorials","companySelect2")
          this.showTutorial(2)
        }
      });
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

  //DELETE ITEM
  public deleteItem(company,slidingItem) {
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

                    //and from currentCompany if it IS the current company
                    if(this.storageService.currentCompany==company){
                      console.log("current company being deleted")
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

    localforage.getItem("companyData").then(result => {
      this.storageService.companyData=result
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

      console.log("this.storageService.companyData",this.storageService.companyData)
      //set the username and secret for the API
      this.httpService.currentUsername=this.storageService.companyData[company].companyUsername
      this.httpService.currentSharedSecret=this.storageService.companyData[company].companySecret

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
                  
                  this.goToRsSelect(company)

              }, error => {
                  loading.dismiss();
                  console.log(error);
                  alert.present();
              }); 
      }

  showTutorial(number){
    console.log("showTutorial opened")
    let tutorial
    if(number==1){
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
    }
    if(number==2){
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
    }

      tutorial.present();
  } 

    ionViewWillEnter() { 
        localforage.getItem("currentCompany").then(result => this.storageService.currentCompany = result ? <Object> result : {});
        return localforage.getItem("companies").then(result => {
          this.companies = result ? <Array<Object>> result : [];
          if(this.companies.length!=0){
            this.companiesNotShown=false;
          }else{
            this.companiesNotShown=true;
          }
        });
    }
}
