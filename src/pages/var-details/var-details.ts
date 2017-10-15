import { Component,PipeTransform,Pipe } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { StorageService } from '../services/storage';

declare var require: any;

@Component({
  selector: 'page-var-details',
  templateUrl: 'var-details.html'
})

export class VarDetailsPage {
  varDetail:any;
  varAttributes:any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storageService: StorageService, public events:Events) {
    if(navParams.get('thisVariable')){
      this.varDetail = navParams.get('thisVariable')
    }else{
      this.varDetail=this.storageService.currentVar
    }

    this.varAttributes=[]

    this.events.publish('showPage:varData', true);

    for (var item in this.varDetail) {
      if(typeof this.varDetail[item]=="string" && this.varDetail[item]!=""){
        if(item=="id"){
          this.varAttributes.push({'name':'Variable','value':this.varDetail[item]})        
        }else{
          this.varAttributes.push({'name':this.cleanString(item),'value':this.cleanString(this.varDetail[item])})
        }
      }
    }
  }

  cleanString(string){
    string=string.replace(/_/g," ") 

    if(string.indexOf("eVar")==-1){
      string=string.charAt(0).toUpperCase() + string.slice(1);
    }   
    string=string.replace("Allocation type","Allocation") 
    string=string.replace("Expiration type","Expiration") 

    return string
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VarDetailsPage');
  }

}
