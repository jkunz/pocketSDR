import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http'; 

import { IonicStorageModule } from '@ionic/storage';
import { Deeplinks } from '@ionic-native/deeplinks';

import { TabsPage } from '../pages/tabs/tabs';
import { AboutPage } from '../pages/about/about';
import { CompanySelectPage } from '../pages/company-select/company-select';
import { CompanyLoginPage } from '../pages/company-login/company-login';
import { RsSelectPage } from '../pages/rs-select/rs-select';
import { VarDetailsPage } from '../pages/var-details/var-details';
import { VarSelectPage } from '../pages/var-select/var-select';

import { StorageServiceProvider } from '../providers/storage-service/storage-service';
import { ApiServiceProvider } from '../providers/api-service/api-service';
import { PageKeeperServiceProvider } from '../providers/page-keeper-service/page-keeper-service';

@NgModule({
  declarations: [
    MyApp,
    CompanySelectPage,
    CompanyLoginPage,
    RsSelectPage,
    VarSelectPage,
    VarDetailsPage,
    TabsPage,
    AboutPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CompanySelectPage,
    CompanyLoginPage, 
    RsSelectPage,
    VarSelectPage,
    VarDetailsPage,
    TabsPage,
    AboutPage
  ],
  providers: [
    Deeplinks,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    StorageServiceProvider,
    ApiServiceProvider,
    PageKeeperServiceProvider
  ]
})
export class AppModule {}
