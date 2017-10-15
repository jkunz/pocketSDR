import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, MenuController } from 'ionic-angular';
import { StatusBar, Splashscreen, Deeplinks } from 'ionic-native';
import { CompanySelectPage } from '../pages/company-select/company-select';
import { CompanyLoginPage } from '../pages/company-login/company-login';
import { RsSelectPage } from '../pages/rs-select/rs-select';
import { VarSelectPage } from '../pages/var-select/var-select';
import { VarDetailsPage } from '../pages/var-details/var-details';
import { TabsPage } from '../pages/tabs/tabs';
import { AboutPage } from '../pages/about/about';
import { StorageService } from '../pages/services/storage';
import { ApiService } from '../pages/services/api';
import { PageKeeperService } from '../pages/services/pageKeeper';

declare var require: any;
const localforage: LocalForage = require("localforage");

@Component({
  templateUrl: 'app.html',
  providers: [ApiService,StorageService,PageKeeperService]
})

export class MyApp {
  rootPage= TabsPage;

  @ViewChild(Nav) nav: Nav;

  pages: Array<{title: string, component: any, index?: number}>;

  constructor(public platform: Platform,public storageService:StorageService, public events:Events, public pageKeeper:PageKeeperService, public menuCtrl:MenuController) {

    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();

      Deeplinks.routeWithNavController(this.nav,{
           '/pocketSDR/APIshortcut/:key' : CompanyLoginPage
        }).subscribe((match) => {
          console.log('match link' + JSON.stringify(match));
        }, (nomatch) => {
          console.warn('Unmatched Route' + JSON.stringify(nomatch));
        });
    });

    this.pages = [
      { title: 'Add/Update Company', component: CompanyLoginPage },
      { title: 'Company Selection', component: TabsPage, index: 0 },
      { title: 'Report Suite Selection', component: TabsPage, index: 1 },
      { title: 'Variables', component: TabsPage, index: 2 },
      { title: 'Variable Details', component: VarDetailsPage },
      { title: 'About this app', component: AboutPage }
    ];

  }

  openPage(page){
    if(page.title == "Company Selection" || page.title == "Report Suite Selection" || page.title == "Variables"){
      this.nav.setRoot(page.component, { index: page.index });
    }else{
      this.nav.push(page.component);      
    }
  }
}

