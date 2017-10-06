import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { StorageService } from '../services/storage';
import { ApiService } from '../services/api';
import { HttpService } from '../services/http.service';
import { VarDetailsPage } from '../var-details/var-details';

declare var require: any;
const localforage: LocalForage = require("localforage");

@Component({
  selector: 'page-var-select',
  templateUrl: 'var-select.html'
})
export class VarSelectPage {
  variables:any;
  listVariables:any;
  companyData:any;
  currentCompany:any;
  searchTerm: string = '';

  //TODO- "don't see a variable? We only show enabled variables- check that it is enabled and that you are in the right report suite"
  constructor(public navCtrl: NavController, public navParams: NavParams, public storageService: StorageService, public httpService:HttpService, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public apiService: ApiService, public events:Events) {
    
  }

  initializeVariables() {
    this.listVariables = this.variables
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeVariables();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.listVariables = this.listVariables.filter((item) => {
        return (JSON.stringify(item).toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  clickVar(varData){
    this.storageService.addToStorageSimple("currentVar",varData)
    this.navCtrl.push(VarDetailsPage,{thisVariable:varData})
  }  

  ionViewDidLoad() {
    console.log('ionViewDidLoad VarSelectPage');
  }

  ionViewWillEnter() { 
  return localforage.getItem("companyData").then(result => {
      if(result){
        this.companyData=result
        let currentCompany=this.storageService.currentCompany
        let currentRS=this.storageService.currentRS

        let myIndex=0
        for (var i = 0; i < this.companyData[currentCompany].reportSuites.length; i++) {
          if(this.companyData[currentCompany].reportSuites[i].rsid==currentRS){
            myIndex=i
          }
        }

        this.variables=this.companyData[currentCompany].reportSuites[myIndex].variables ? <Array<Object>> this.companyData[currentCompany].reportSuites[myIndex].variables : []
        this.initializeVariables();
      }else{
        this.variables=[{name:"noVariables"}]
      }
    }, error => {
        this.variables=[{name:"noVariables"}]
    });
  }
}
