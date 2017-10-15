import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events, Nav } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api';
import { HttpService } from '../services/http.service';
import { StorageService } from '../services/storage';
import { TabsPage } from '../tabs/tabs';
import { RsSelectPage } from '../rs-select/rs-select';

declare var require: any;
const localforage: LocalForage = require("localforage");

@Component({
  selector: 'page-company-login',
  templateUrl: 'company-login.html' 
})
export class CompanyLoginPage {
  APILogin: FormGroup;
  key:any;
  loginCompany:string;
  loginUsername:string;
  loginSecret:string;
  currentSuite:boolean;
  shownTutorials:any;

  constructor(public navCtrl: NavController, public nav: Nav, public navParams: NavParams, public formBuilder: FormBuilder, public apiService: ApiService, public storageService: StorageService, public loadingCtrl : LoadingController, public alertCtrl: AlertController, public httpService: HttpService, public events:Events ) {

    this.shownTutorials=localforage.getItem("shownTutorials").then(result => {
      this.shownTutorials = result ? <Array<Object>> result : [];
      if(this.storageService.tutorial==true && !this.shownTutorials.includes("companyLogin")){
        this.storageService.addToStorageArray("shownTutorials","companyLogin")
        this.showTutorial()
      }
    });

    this.currentSuite=false
    let paramsKey=decodeURI(navParams.get('key'));
    this.loginSecret="ee9be22adfd8f4db4c3570784e55845d"
    this.loginUsername="jkunz:Jennifer Kunz"
    this.loginCompany="Jenn Kunz Test"//switch back to "" when not testing
    
    if(paramsKey != "undefined"){
      this.loginSecret=paramsKey.split("|")[1]
      this.loginUsername=paramsKey.split("|")[0]
      this.loginCompany=this.loginUsername.substring(this.loginUsername.indexOf(":")+1)
    }
    
    this.APILogin = formBuilder.group({
        CompanyName: [this.loginCompany],
        Username: [this.loginUsername],
        SharedSecret: [this.loginSecret]
    }); 
  }

  checkIfPresent(inputName){
    console.log("detected change",inputName.controls.CompanyName.value)
    if(this.storageService.companies.includes(inputName.controls.CompanyName.value)){
      this.currentSuite=true
    }else{
      this.currentSuite=false
    }
  }

  loginAPI(credentials){ 
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

    this.storageService.currentRS=""
    this.storageService.addToStorageSimple("currentRS","")    
    this.events.publish('showPage:RSList', false);
    this.storageService.currentVar=""
    this.storageService.addToStorageSimple("currentVar","")
    this.events.publish('showPage:varList', false);
    this.events.publish('showPage:varData', false);


    //set the username and secret for the API
    this.httpService.currentUsername=credentials.controls.Username.value;
    this.httpService.currentSharedSecret=credentials.controls.SharedSecret.value;

    //this.storageService.addToStorage('tempCredentials',credentials)
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

                if(!this.storageService.companies.includes(credentials.controls.CompanyName.value)){
                  this.storageService.addToStorageArray("companies",credentials.controls.CompanyName.value);
                }
                this.storageService.currentCompany=credentials.controls.CompanyName.value;
                this.storageService.currentUsername=credentials.controls.Username.value;
                this.storageService.currentSharedSecret=credentials.controls.SharedSecret.value;

                this.storageService.addToStorageComplex("companyData",credentials.controls.CompanyName.value,companyData)
                this.storageService.addToStorageSimple("currentCompany",credentials.controls.CompanyName.value)

                loading.dismiss();
                
                this.events.publish('showPage:RSList', true);
                this.nav.setRoot(TabsPage, { index: '1' });

            }, error => {
                loading.dismiss();
                console.log(error);
                alert.present();
            }); 

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
      tutorial.present();
  } 


  ionViewDidLoad() {
    console.log('ionViewDidLoad CompanyLoginPage');
  }

}
