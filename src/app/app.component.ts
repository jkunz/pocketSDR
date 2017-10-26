import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Deeplinks } from '@ionic-native/deeplinks';

import { CompanySelectPage } from '../pages/company-select/company-select';
import { CompanyLoginPage } from '../pages/company-login/company-login';
import { RsSelectPage } from '../pages/rs-select/rs-select';
import { VarSelectPage } from '../pages/var-select/var-select';
import { VarDetailsPage } from '../pages/var-details/var-details';
import { TabsPage } from '../pages/tabs/tabs';
import { AboutPage } from '../pages/about/about';

import { PageKeeperServiceProvider } from '../providers/page-keeper-service/page-keeper-service';

@Component({
  templateUrl: 'app.html',
  providers: [PageKeeperServiceProvider]  
})
export class MyApp {
  rootPage:any = TabsPage;  
  @ViewChild(Nav) nav: Nav;  
  pages: Array<{title: string, component: any, index?: number}>;

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public menuCtrl:MenuController, public events:Events, public pageKeeper:PageKeeperServiceProvider, public deeplinks:Deeplinks) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.pages = [
        { title: 'Add/Update Company', component: CompanyLoginPage },
        { title: 'Company Selection', component: TabsPage, index: 0 },
        { title: 'Report Suite Selection', component: TabsPage, index: 1 },
        { title: 'Variables', component: TabsPage, index: 2 },
        { title: 'Variable Details', component: VarDetailsPage },
        { title: 'About this app', component: AboutPage }
      ];
    });
  }

  openPage(page){
    if(page.title == "Company Selection" || page.title == "Report Suite Selection" || page.title == "Variables"){
      this.nav.setRoot(page.component, { index: page.index });
    }else{
      this.nav.push(page.component);      
    }
  }

  ngAfterViewInit() {
    this.platform.ready().then(() => {
      /*
      IonicDeeplink.route({
        '/about-us': AboutPage,
        '/universal-links-test': AboutPage,
        '/products/:productId': ProductPage
      }, function(match) {
        // Handle the route manually
      }, function(nomatch) {
        // No match
      })
      */

      // Convenience to route with a given nav
      this.deeplinks.routeWithNavController(this.nav, {
        '/pocketSDR/APIshortcut/:APIkey' : CompanyLoginPage
      }).subscribe((match) => {
        console.log('Successfully routed', JSON.stringify(match));
      }, (nomatch) => {
        console.warn('Unmatched Route', nomatch);
      });
    })
  }
  
}

