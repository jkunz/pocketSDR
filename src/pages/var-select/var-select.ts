import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events} from 'ionic-angular';

import { StorageServiceProvider  } from '../../providers/storage-service/storage-service';
import { VarDetailsPage } from '../var-details/var-details';

declare var require: any;
declare var _satellite: any;

@IonicPage()
@Component({
  selector: 'page-var-select',
  templateUrl: 'var-select.html'
})
export class VarSelectPage {
  variables:any;
  listVariables:any;
  companyData:any;
  currentCompany:any;
  searchTerm: string = '';
  DTMenabled:any;

  //TODO- "don't see a variable? We only show enabled variables- check that it is enabled and that you are in the right report suite"
  constructor(public navCtrl: NavController, public navParams: NavParams, public storageService: StorageServiceProvider, public storage:Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public events:Events) {
    if(typeof _satellite=="undefined"){
      this.DTMenabled=false
    }else{
      this.DTMenabled=true
    }
  }

  initializeVariables() {
    this.listVariables = this.variables
  }

  analyticsTrackSearch(val){
    if(this.DTMenabled===true){
       _satellite.data.customVars["search type"]="variable selection:search"
      if(val && val!=""){_satellite.data.customVars["search term"]=val}else{
        _satellite.data.customVars["search term"]="none entered"
      }
      _satellite.track("search");
    }
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeVariables();

    // set val to the value of the searchbar
    let val = ev.target.value;

    let doneTypingInterval="500"
    let typingTimer = setTimeout(this.analyticsTrackSearch(val), doneTypingInterval);
    clearTimeout(typingTimer)

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.listVariables = this.listVariables.filter((item) => {
        return (JSON.stringify(item).toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  clickVar(varData){
    this.storageService.addToStorageSimple("currentVar",varData)
    this.navCtrl.push(VarDetailsPage,{thisVariable:varData})
  }  

  fireAnalytics() {
    if(this.DTMenabled===true){
      _satellite.data.customVars["company"]=this.currentCompany  
      _satellite.data.customVars["page name"]="Variable Selection"
      _satellite.track("page view");
    }  
  }

  ionViewWillEnter(StorageServiceProvider) { 
    if(this.storageService.companyData){
      this.companyData=this.storageService.companyData;
      this.currentCompany=this.storageService.currentCompany;
      let currentRS=this.storageService.currentRS
      let myIndex=0
      for (var i = 0; i < this.companyData[this.currentCompany].reportSuites.length; i++) {
        if(this.companyData[this.currentCompany].reportSuites[i].rsid==currentRS){
          myIndex=i;
          break;
        }
      }

      this.variables=this.companyData[this.currentCompany].reportSuites[myIndex].variables ? <Array<Object>> this.companyData[this.currentCompany].reportSuites[myIndex].variables : []
      console.log("my variables:",JSON.stringify(this.variables));
      this.initializeVariables();
      this.fireAnalytics()

    }else{
      return this.storage.get("companyData").then(result => {
        if(result){
          this.companyData=result
          this.currentCompany=this.storageService.currentCompany
          let currentRS=this.storageService.currentRS
  
          let myIndex=0
          for (var i = 0; i < this.companyData[this.currentCompany].reportSuites.length; i++) {
            console.log("checking RS:",JSON.stringify(this.companyData[this.currentCompany].reportSuites[i].rsid))
            if(this.companyData[this.currentCompany].reportSuites[i].rsid==currentRS){
              myIndex=i;
              console.log("this RS matches:",JSON.stringify(this.companyData[this.currentCompany].reportSuites[i]))
              break;
            }
          }
  
          this.variables=this.companyData[this.currentCompany].reportSuites[myIndex].variables ? <Array<Object>> this.companyData[this.currentCompany].reportSuites[myIndex].variables : []
          console.log("my variables:",JSON.stringify(this.variables));
          this.initializeVariables();
          this.fireAnalytics()
        }else{
          this.variables=[{name:"noVariables"}]
          this.fireAnalytics()
        }
      }, error => {
          this.variables=[{name:"noVariables"}]
          this.fireAnalytics()
      });
    }
  }
}


//TODO- empty search when revisiting page (or force it to search)