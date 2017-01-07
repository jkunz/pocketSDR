import { Component } from '@angular/core';
import { NavController , AlertController, NavParams } from 'ionic-angular';
import { StorageService } from '../services/storage';

@Component({
  selector: 'page-company-select',
  templateUrl: 'company-select.html'
})
export class CompanySelectPage {
  companies : string[];
  key:any;

  constructor(public navCtrl: NavController, private alertController: AlertController, private storageService : StorageService, public navParams: NavParams) {
            this.companies=storageService.companies;
            this.key = navParams.get('key')
  }

  //DELETE ITEM
  public deleteItem(item,slidingItem) {
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
                    this.storageService.deleteFromStorage('companies',item);
                    this.companies=this.storageService.companies;
                  }
              }
          ]
      });
      alert.present();
  }  
}
