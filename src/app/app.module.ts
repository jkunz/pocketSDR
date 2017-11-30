import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http'; 

import { IonicStorageModule } from '@ionic/storage';
import { Deeplinks } from '@ionic-native/deeplinks';

import { TabsPageModule } from '../pages/tabs/tabs.module';
import { AboutPageModule } from '../pages/about/about.module';
import { CompanySelectPageModule } from '../pages/company-select/company-select.module';
import { CompanyLoginPageModule } from '../pages/company-login/company-login.module';
import { RsSelectPageModule } from '../pages/rs-select/rs-select.module';
import { VarDetailsPageModule } from '../pages/var-details/var-details.module';
import { VarSelectPageModule } from '../pages/var-select/var-select.module';

import { StorageServiceProvider } from '../providers/storage-service/storage-service';
import { ApiServiceProvider } from '../providers/api-service/api-service';
import { PageKeeperServiceProvider } from '../providers/page-keeper-service/page-keeper-service';

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    }),
    IonicStorageModule.forRoot({
      name:'_ionicStorage',
      storeName: '_pocketSDR',
    }),
    AboutPageModule,
    CompanySelectPageModule,
    CompanyLoginPageModule,
    RsSelectPageModule,
    VarSelectPageModule,
    VarDetailsPageModule,
    TabsPageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
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
