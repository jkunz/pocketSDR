import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VarSelectPage } from './var-select';

@NgModule({
  declarations: [
    VarSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(VarSelectPage),
  ],
})
export class VarSelectPageModule {}
