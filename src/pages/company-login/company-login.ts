import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events, Nav } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ApiServiceProvider  } from '../../providers/api-service/api-service';
import { StorageServiceProvider  } from '../../providers/storage-service/storage-service';

import { TabsPage } from '../tabs/tabs';

declare var _satellite: any;

@IonicPage()
@Component({
  selector: 'page-company-login',
  templateUrl: 'company-login.html',
})
export class CompanyLoginPage {
  APIlogin: FormGroup;
  APIkey:any;
  loginCompany:string;
  loginUsername:string;
  loginSecret:string;
  currentSuite:boolean;
  shownTutorials:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public loadingCtrl : LoadingController, public alertCtrl: AlertController, public apiService: ApiServiceProvider, public storageService:StorageServiceProvider, public events:Events, public nav:Nav) {
    let paramsKey=decodeURI(navParams.get('key'));

    this.loginSecret=""//"ee9be22adfd8f4db4c3570784e55845d"
    this.loginUsername=""//"jkunz:Jennifer Kunz"
    this.loginCompany=""//"Jenn Kunz Test"

    if(paramsKey != "undefined"){
      this.storageService.deeplink=true
      this.storageService.addToStorageArray("shownTutorials","companyLogin")
      this.loginSecret=paramsKey.split("|")[1]
      this.loginUsername=paramsKey.split("|")[0]
      this.loginCompany=this.loginUsername.substring(this.loginUsername.indexOf(":")+1)
      _satellite.data.customVars["api shortcut"]="true"
    }

    this.shownTutorials=this.storageService.shownTutorials || []
    if(this.storageService.deeplink=="false" && (this.storageService.tutorial==true && !this.shownTutorials.includes("companyLogin"))){
      this.storageService.addToStorageArray("shownTutorials","companyLogin")
      _satellite.data.customVars["tutorial mode"]="Tutorial Mode"
      this.showTutorial()
    }
  
    this.APIlogin = formBuilder.group({
        CompanyName: [this.loginCompany],
        Username: [this.loginUsername],
        SharedSecret: [this.loginSecret]
      }); 
  }

  loginAPI(credentials){ 
    const loading = this.loadingCtrl.create({
        content: 'Pulling info from the Adobe API, please wait...'
    });

    loading.present()

    _satellite.data.customVars["api type"]="company login"
    _satellite.data.customVars["company"]=this.loginCompany
    _satellite.track("api attempt")

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


    this.apiService.currentUsername=credentials.controls.Username.value;
    this.apiService.currentSharedSecret=credentials.controls.SharedSecret.value;
    let params={}

    this.apiService.hitAPI('Company.GetReportSuites',params)              
            .subscribe(result => {
                let companyData={
                  companyName:credentials.controls.CompanyName.value,
                  companyUsername:credentials.controls.Username.value,
                  companySecret:credentials.controls.SharedSecret.value,
                  reportSuites:result.report_suites,
                  researchedSuites:[]
                }

                //these things only need to live in temp storage
                this.storageService.currentCompany=credentials.controls.CompanyName.value;
                this.storageService.currentUsername=credentials.controls.Username.value;
                this.storageService.currentSharedSecret=credentials.controls.SharedSecret.value;

                //here is where we write to long-term and short-term storage
                if(this.storageService.companies && !this.storageService.companies.includes(credentials.controls.CompanyName.value)){
                  //only add the company to the companies array if it doesn't yet exist
                  this.storageService.addToStorageArray("companies",credentials.controls.CompanyName.value);
                  _satellite.data.customVars["api type"]="company login:refresh"
                }else{
                  _satellite.data.customVars["api type"]="company login:new"
                }
                this.storageService.addToStorageComplex("companyData",credentials.controls.CompanyName.value,companyData)
                this.storageService.addToStorageSimple("currentCompany",credentials.controls.CompanyName.value)
                
                _satellite.track("api success")
                this.events.publish('showPage:RSList', true);
                loading.dismiss();
                this.nav.setRoot(TabsPage, { index: '1' });
            }, error => {
                _satellite.data.customVars["api error"]=error
                _satellite.track("api error")
                loading.dismiss();
                console.log(error);
                alert.present();
            }); 

  }

  checkIfPresent(inputName){
    console.log("inputName",inputName)
    console.log("detected change",inputName.controls.CompanyName.value)
    if(this.storageService.companies && this.storageService.companies.includes(inputName.controls.CompanyName.value)){
      this.currentSuite=true
    }else{
      this.currentSuite=false
    }
  }

  showTutorial(){
    console.log("showTutorial opened")
     let tutorial = this.alertCtrl.create({
          title: "Tip",
          message: "Don't feel like typing in your 40 character API key on your mobile device? Use the desktop key importer at digitalDataTactics.com/pocketSDR",
          buttons: [
              {
                  text: "OK",
                  role: 'cancel',
              }
          ]
      });
      if(!_satellite.data.customVars["tutorial mode"]){
        _satellite.data.customVars["tutorial mode"]="Manually Opened"
      }
      _satellite.data.customVars["tutorial"]="Company Login: Api Importer"
      _satellite.track("tutorial");      
      tutorial.present();
  } 

  ionViewDidEnter() {
    _satellite.data.customVars["page name"]="Company Login"
    _satellite.track("page view");
  }

}
