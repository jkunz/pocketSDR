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
      console.log("RS selection event fired")
      this.shownPages['Report Suite Selection']=data
    });
    this.events.subscribe('showPage:VarList', data => {
      console.log("Var List event fired")
      this.shownPages['Variables']=data
    });
    this.events.subscribe('showPage:VarData', data => {
      console.log("Var Data event fired")
      this.shownPages['Variable Details']=data
    });
  }

}
