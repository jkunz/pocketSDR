import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RsSelectPage } from './rs-select';

@NgModule({
  declarations: [
    RsSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(RsSelectPage),
  ],
})
export class RsSelectPageModule {}
