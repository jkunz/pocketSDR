import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events, Nav } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ApiServiceProvider  } from '../../providers/api-service/api-service';
import { StorageServiceProvider  } from '../../providers/storage-service/storage-service';

import { TabsPage } from '../tabs/tabs';


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
    this.loginSecret="ee9be22adfd8f4db4c3570784e55845d"
    this.loginUsername="jkunz:Jennifer Kunz"
    this.loginCompany="Jenn Kunz Test"//switch back to "" when not testing

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
                if(!this.storageService.companies.includes(credentials.controls.CompanyName.value)){
                  //only add the company to the companies array if it doesn't yet exist
                  this.storageService.addToStorageArray("companies",credentials.controls.CompanyName.value);
                }
                this.storageService.addToStorageComplex("companyData",credentials.controls.CompanyName.value,companyData)
                this.storageService.addToStorageSimple("currentCompany",credentials.controls.CompanyName.value)

                this.events.publish('showPage:RSList', true);
                loading.dismiss();
                this.nav.setRoot(TabsPage, { index: '1' });
            }, error => {
                loading.dismiss();
                console.log(error);
                alert.present();
            }); 

  }

  checkIfPresent(inputName){

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompanyLoginPage');
  }

}
