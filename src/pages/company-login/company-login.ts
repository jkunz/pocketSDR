import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api';
import { StorageService } from '../services/storage';

@Component({
  selector: 'page-company-login',
  templateUrl: 'company-login.html' 
})
export class CompanyLoginPage {
  APILogin: FormGroup;
  key:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public apiService: ApiService, public storageService: StorageService) {
    this.APILogin = formBuilder.group({
        CompanyName: [''],
        Username: [''],
        SharedSecret: ['']
    });
    this.key = navParams.get('key')
  
  }

  loginAPI(credentials){ 
    this.storageService.tempCompany=credentials.CompanyName;
    this.storageService.tempUsername=credentials.Username;
    this.storageService.tempSharedSecret=credentials.SharedSecret;

    //this.storageService.addToStorage('tempCredentials',credentials)
    let params={}
    this.apiService.hitAPI('Company.GetReportSuites',params)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompanyLoginPage');
  }

}
