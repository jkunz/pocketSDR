import { Component } from '@angular/core';
import { NavController , AlertController, Events } from 'ionic-angular';
import { StorageService } from '../services/storage';
import { RsSelectPage } from '../rs-select/rs-select';

declare var require: any;
const localforage: LocalForage = require("localforage");

@Component({
  selector: 'page-company-select',
  templateUrl: 'company-select.html'
})

export class CompanySelectPage {
  companies : any;

    constructor(public navCtrl: NavController, public alertController: AlertController, public storageService : StorageService, public events:Events) {
       
    }

    goToRsSelect(company){
        this.storageService.currentCompany=company
        this.storageService.addToStorageSimple("currentCompany",company)
        this.events.publish('showPage:RSList', true);
        this.navCtrl.push(RsSelectPage);
    }

  //DELETE ITEM
  public deleteItem(company,slidingItem) {
      let alert = this.alertController.create({
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

                    //and from currentCompany
                    this.storageService.addToStorageSimple("currentCompany","")
                    this.storageService.addToStorageSimple("currentVar","")
                    this.storageService.addToStorageSimple("currentRS","")
                  }
              }
          ]
      });
      alert.present();
  }  

    ionViewWillEnter() { 
        localforage.getItem("currentCompany").then(result => this.storageService.currentCompany = result ? <Object> result : {});
        return localforage.getItem("companies").then(result => this.companies = result ? <Array<Object>> result : []);
    }
}
