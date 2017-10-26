import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompanySelectPage } from './company-select';

@NgModule({
  declarations: [
    CompanySelectPage,
  ],
  imports: [
    IonicPageModule.forChild(CompanySelectPage),
  ],
})
export class CompanySelectPageModule {}
