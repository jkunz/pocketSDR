import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

@Injectable()
export class PageKeeperServiceProvider {
  shownPages: any

  constructor(public events:Events) {
    this.shownPages={}
    this.shownPages['Company Selection']=true
    this.shownPages['Add/Update Company']=true
    this.shownPages['About this app']=true

    this.events.subscribe('showPage:RSList', data => {
      this.shownPages['Report Suite Selection']=data
    });
    this.events.subscribe('showPage:varList', data => {
      this.shownPages['Variables']=data
    });
    this.events.subscribe('showPage:varData', data => {
      this.shownPages['Variable Details']=data
    });
    
    console.log('Hello PageKeeperServiceProvider Provider');
  }

}
