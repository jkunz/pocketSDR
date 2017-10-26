import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { CompanySelectPage } from '../company-select/company-select';
import { RsSelectPage } from '../rs-select/rs-select';
import { VarSelectPage } from '../var-select/var-select';

import { PageKeeperServiceProvider } from '../../providers/page-keeper-service/page-keeper-service';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  companySelectionRoot : any  = CompanySelectPage
  reportSuiteSelectionRoot : any = RsSelectPage
  variableSelectionRoot : any = VarSelectPage
  myIndex : number
  
  constructor(public navCtrl: NavController, public navParams: NavParams,  public events:Events, public pageKeeper:PageKeeperServiceProvider) {
    
        this.myIndex = 0;
        if (navParams.data.index){ this.myIndex = navParams.data.index;}
        
      }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
