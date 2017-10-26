import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompanyLoginPage } from './company-login';

@NgModule({
  declarations: [
    CompanyLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(CompanyLoginPage),
  ],
})
export class CompanyLoginPageModule {}
