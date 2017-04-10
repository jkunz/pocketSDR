import { Component,PipeTransform,Pipe } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../services/storage';

@Component({
  selector: 'page-var-details',
  templateUrl: 'var-details.html'
})

export class VarDetailsPage {
  varDetail:any;
  varAttributes:any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storageService: StorageService) {
    this.varDetail = navParams.get('thisVariable'); 
    this.varAttributes=[]

    console.log("this.varDetail:")
    console.log(this.varDetail)

    for (var item in this.varDetail) {
      if(typeof this.varDetail[item]=="string" && this.varDetail[item]!=""){
        this.varAttributes.push({'name':this.cleanString(item),'value':this.cleanString(this.varDetail[item])})
      }
    }

    console.log("this.varAttributes:")
    console.log(this.varAttributes)

    this.storageService.addToStorageSimple("currentVar",this.varDetail)
  }

  cleanString(string){
    string=string.replace(/_/g," ") 
    
    if(string=="id"){
      string="variable"
    }

    if(string.indexOf("evar")!=-1){
      string=string.replace("evar","eVar")
    }else{
      string=string.charAt(0).toUpperCase() + string.slice(1);
    }
    return string
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VarDetailsPage');
  }

}
