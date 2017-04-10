import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar, Splashscreen, Deeplinks } from 'ionic-native';
import { CompanySelectPage } from '../pages/company-select/company-select';
import { CompanyLoginPage } from '../pages/company-login/company-login';
import { RsSelectPage } from '../pages/rs-select/rs-select';
import { VarSelectPage } from '../pages/var-select/var-select';
import { VarDetailsPage } from '../pages/var-details/var-details';
import { StorageService } from '../pages/services/storage';
import { ApiService } from '../pages/services/api';

declare var require: any;
const localforage: LocalForage = require("localforage");

@Component({
  templateUrl: 'app.html',
  providers: [ApiService,StorageService]
})

export class MyApp {
  rootPage: any= CompanySelectPage;
  showPages:any;

  @ViewChild(Nav) nav: Nav;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,public storageService:StorageService, public events:Events) {

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
      { title: 'Company Selection', component: CompanySelectPage },
      { title: 'Company Login', component: CompanyLoginPage },
      { title: 'Report Suites', component: RsSelectPage },
      { title: 'Variables', component: VarSelectPage },
      { title: 'Variable Details', component: VarDetailsPage },
    ];

    this.showPages={}
    this.showPages['Company Selection']=true
    this.showPages['Company Login']=true

    this.events.subscribe('showPage:RSList', data => {
      this.showPages['Report Suites']=data
    });
    this.events.subscribe('showPage:varList', data => {
      this.showPages['Variables']=data
    });
    this.events.subscribe('showPage:varData', data => {
      this.showPages['Variable Details']=data
    });

  }

  openPage(page){
    if(page.title=="Company Selection"){
      this.nav.setRoot(page.component);
    }if(page.title=="Variable Details"){
      localforage.getItem("currentVar").then(result => {
        this.nav.push(page.component,{thisVariable:result});
      })
    }else{
      this.nav.push(page.component);
    }
  }
}

