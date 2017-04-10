import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { CompanySelectPage } from '../pages/company-select/company-select';
import { CompanyLoginPage } from '../pages/company-login/company-login';
import { RsSelectPage } from '../pages/rs-select/rs-select';
import { HttpModule } from '@angular/http';
import { HttpService } from '../pages/services/http.service';
import { StorageService } from '../pages/services/storage';
import { VarDetailsPage } from '../pages/var-details/var-details';
import { VarSelectPage } from '../pages/var-select/var-select';

@NgModule({
  declarations: [
    MyApp,
    CompanySelectPage,
    CompanyLoginPage,
    RsSelectPage,
    VarSelectPage,
    VarDetailsPage
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
    VarDetailsPage
  ],
  providers: [
    HttpService,
    Storage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
