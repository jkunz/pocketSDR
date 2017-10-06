import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { CompanySelectPage } from '../pages/company-select/company-select';
import { CompanyLoginPage } from '../pages/company-login/company-login';
import { RsSelectPage } from '../pages/rs-select/rs-select';
import { VarDetailsPage } from '../pages/var-details/var-details';
import { VarSelectPage } from '../pages/var-select/var-select';
import { TabsPage } from '../pages/tabs/tabs';
import { HttpModule } from '@angular/http';
import { HttpService } from '../pages/services/http.service';

@NgModule({
  declarations: [
    MyApp,
    CompanySelectPage,
    CompanyLoginPage,
    RsSelectPage,
    VarSelectPage,
    VarDetailsPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CompanySelectPage,
    CompanyLoginPage, 
    RsSelectPage,
    VarSelectPage,
    VarDetailsPage,
    TabsPage
  ],
  providers: [
    HttpService,
    Storage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
