import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events, Nav } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api';
import { HttpService } from '../services/http.service';
import { StorageService } from '../services/storage';
import { TabsPage } from '../tabs/tabs';
import { RsSelectPage } from '../rs-select/rs-select';

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

  constructor(public navCtrl: NavController, public nav: Nav, public navParams: NavParams, public formBuilder: FormBuilder, public apiService: ApiService, public storageService: StorageService, public loadingCtrl : LoadingController, public alertCtrl: AlertController, public httpService: HttpService, public events:Events ) {
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

  loginAPI(credentials){ 
    let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: 'Pulling info from the Adobe API, please wait...'
    });

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

    loading.present()

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

                this.storageService.addToStorageArray("companies",credentials.controls.CompanyName.value);
                  
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompanyLoginPage');
  }

}
