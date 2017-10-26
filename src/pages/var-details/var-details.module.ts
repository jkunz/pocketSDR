import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VarDetailsPage } from './var-details';

@NgModule({
  declarations: [
    VarDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(VarDetailsPage),
  ],
})
export class VarDetailsPageModule {}
