import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events} from 'ionic-angular';

import { StorageServiceProvider  } from '../../providers/storage-service/storage-service';

declare var _satellite: any;

@IonicPage()
@Component({
  selector: 'page-var-details',
  templateUrl: 'var-details.html',
})
export class VarDetailsPage {
  varDetail:any;
  varAttributes:any[];
  DTMenabled:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storageService: StorageServiceProvider, public events:Events) {
    if(typeof _satellite=="undefined"){
      this.DTMenabled=false
    }else{
      this.DTMenabled=true
    }

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
    string=string.replace("Most recent last","Most Recent") 

    return string
  }

  ionViewDidEnter() {
    if(typeof _satellite!="undefined"){
      _satellite.data.customVars["page name"]="Variable Details"
      _satellite.track("page view");
    }  
  }

}

//TODO- does merchandising show up?
