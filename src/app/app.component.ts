import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, Deeplinks } from 'ionic-native';
import { CompanySelectPage } from '../pages/company-select/company-select';
import { CompanyLoginPage } from '../pages/company-login/company-login';
import { StorageService } from '../pages/services/storage';
import { ApiService } from '../pages/services/api';

@Component({
  templateUrl: 'app.html',
  providers: [StorageService, ApiService]
})

export class MyApp {
  rootPage: any= CompanySelectPage;

  @ViewChild(Nav) nav: Nav;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
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
      { title: 'Company Login', component: CompanyLoginPage }
    ];
  }

  openPage(page){
    if(page.title=="Company Selection"){
      this.nav.setRoot(page.component);
    }else{
      this.nav.push(page.component);
    }
  }
}

