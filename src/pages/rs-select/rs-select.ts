import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events, Nav } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

import { StorageServiceProvider  } from '../../providers/storage-service/storage-service';
import { ApiServiceProvider  } from '../../providers/api-service/api-service';

declare var _satellite: any;

@IonicPage()
@Component({
  selector: 'page-rs-select',
  templateUrl: 'rs-select.html',
})
export class RsSelectPage {
  reportSuites:any;
  companyData:any;
  currentCompany:any;
  shownTutorials:any;
  listSuites:any;
  menu:any;
  numberOfSuites:any;
  researchSuites:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public nav:Nav, public storageService: StorageServiceProvider, public storage:Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public apiService: ApiServiceProvider, public events:Events) {
    this.shownTutorials=this.storageService.shownTutorials
    if(this.storageService.tutorial==true && !this.shownTutorials.includes("RSselect")){
      this.storageService.addToStorageArray("shownTutorials","RSselect")
      _satellite.data.customVars["tutorial mode"]="Tutorial Mode"      
      this.showTutorial()
    }
  }

  goToRsDetails(rsid){
    console.log("goToRsDetails running")
    this.events.publish('showPage:VarList', true);
    this.storageService.currentRS=rsid
    this.storageService.addToStorageSimple("currentRS",rsid)
    this.navCtrl.parent.select(2); //parent is the tabs page; it's the 3rd in the array ("2" in javascript terms)
    //this.nav.setRoot(TabsPage, { index: 2 });//parent is the tabs page; it's the 3rd in the array ("2" in javascript terms)
  }

  search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
      if (myArray[i].name === nameKey) {
        return myArray[i];
      }
    }
  }

  clickRS(rsid){
    this.storageService.currentRS=rsid;
    let isResearched=false
    for(var i=0;i<this.companyData[this.currentCompany].researchedSuites.length;i++){
        if(this.companyData[this.currentCompany].researchedSuites[i]===rsid){isResearched=true}
    }
    if(isResearched==true){
      this.goToRsDetails(rsid)
    }else{
      _satellite.data.customVars["api type"]="Report Suite Selection:new"
      this.pullRS(rsid)
    }
  }
    
  pullRS(rsid){ 
    _satellite.track("api attempt")
    let loading = this.loadingCtrl.create({
        content: 'Pulling info from the Adobe API, please wait... (this takes a while)'
    });

    let alert = this.alertCtrl.create({
      title: "Something went wrong",
      message: "We weren't able to communicate with the API- please double check that you have connectivity and that your credentials are valid.",
      buttons: [
        {
            text: "Take me back",
            role: 'cancel',
        }
      ]
    });

    loading.present()

    this.apiService.currentUsername=this.companyData[this.currentCompany].companyUsername;
    this.apiService.currentSharedSecret=this.companyData[this.currentCompany].companySecret;

    var params = {
      "rsid_list":[
        rsid
      ]
    }

    this.apiService.hitAPI('ReportSuite.GetEvars',params)              
      .subscribe(result => {
        let enabledVariables=[]

        for (var i = 0; i < result[0].evars.length; i++) {
          if(result[0].evars[i].enabled!=false){
            if(result[0].evars[i].type=="text_string"){result[0].evars[i].type="Text String"}
            if(result[0].evars[i].id=="trackingcode"){result[0].evars[i].id="campaign"}
            result[0].evars[i].id=result[0].evars[i].id.replace("evar","eVar")
            if(result[0].evars[i].expirationType=="day"){
              result[0].evars[i].expirationType=result[0].evars[i].expiration_custom_days + " days"
            }
            delete result[0].evars[i].expiration_custom_days

            enabledVariables.push(result[0].evars[i])
          }
        }

        this.apiService.hitAPI('ReportSuite.GetProps',params)   
          .subscribe(result => {
            for (var i = 0; i < result[0].props.length; i++) {
                enabledVariables.push(result[0].props[i])
            }
            this.apiService.hitAPI('ReportSuite.GetEvents',params)   
              .subscribe(result => {
                for (var i = 0; i < result[0].events.length; i++) { 
                  //only grab enabled events, not including instances or visits
                  if(result[0].events[i].type!="disabled" && result[0].events[i].id.indexOf('visit')==-1 && result[0].events[i].id.indexOf('instances')==-1 && result[0].events[i].id.indexOf('pageviews')==-1 ){
                    switch (result[0].events[i].id) {
                      case "cartviews":
                        result[0].events[i].id="scView"
                        break;
                      case "checkouts":
                        result[0].events[i].id="scCheckout"
                        break;
                      case "cartadditions":
                        result[0].events[i].id="scAdd"
                        break;
                      case "cartremovals":
                        result[0].events[i].id="scRemove"
                        break;
                    }
                    enabledVariables.push(result[0].events[i])
                  }
                } 
                let myIndex=0
                for (var i = 0; i < this.companyData[this.currentCompany].reportSuites.length; i++) {
                  if(this.companyData[this.currentCompany].reportSuites[i].rsid==rsid){
                    myIndex=i
                  }
                }

                var date=new Date()
                var monthNames = [
                  "January", "February", "March",
                  "April", "May", "June", "July",
                  "August", "September", "October",
                  "November", "December"
                ];

                var day = date.getDate();
                var monthIndex = date.getMonth();
                var year = date.getFullYear();

                var lastUpdated=monthNames[monthIndex] + ' ' + day + ', ' + year;

                this.companyData[this.currentCompany].reportSuites[myIndex].variables=enabledVariables
                this.companyData[this.currentCompany].reportSuites[myIndex].lastUpdated=lastUpdated

                this.storageService.addToStorageComplex("companyData",this.currentCompany,this.companyData[this.currentCompany])

                this.researchSuites=0
                for (var i = 0; i < this.reportSuites.length; i++) {
                  if(this.reportSuites[i].lastUpdated){
                    this.researchSuites=this.researchSuites+1
                  }
                }
                _satellite.data.customVars["number of RSes"]=this.researchSuites.toString() + "/" + this.listSuites.length.toString() 
                _satellite.track("api success")

                loading.dismiss();
                this.goToRsDetails(rsid)
              }
            )
          }
        )
        this.companyData[this.currentCompany].researchedSuites.push(rsid)

    }, error => {
          _satellite.data.customVars["api error"]=error
          _satellite.track("api error")
          loading.dismiss();
          alert.present();
      }); 

  }

  refreshItem(rsid){
    _satellite.data.customVars["api type"]="Report Suite Selection:refresh"
    this.pullRS(rsid)
  }

  initializeSuites() {
    this.listSuites = this.reportSuites
  }

  analyticsTrackSearch(val){
    _satellite.data.customVars["search type"]="report suite selection:search"
    if(val && val!=""){_satellite.data.customVars["search term"]=val}else{
      _satellite.data.customVars["search term"]="none entered"
    }
    _satellite.track("search"); 
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeSuites();

    // set val to the value of the searchbar
    let val = ev.target.value;

    let doneTypingInterval="500"
    let typingTimer = setTimeout(this.analyticsTrackSearch(val), doneTypingInterval);
    clearTimeout(typingTimer)

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.listSuites = this.listSuites.filter((item) => {
        return (JSON.stringify(item).toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  showTutorial(){
      let tutorial = this.alertCtrl.create({
          title: "Tip",
          message: "Pulling RS data takes time, so by default we only do it once per RS. If you want to get updated variable information, swipe left and hit refresh",
          buttons: [
              {
                  text: "OK",
                  role: 'cancel',
              }
          ]
      });
      tutorial.present();
      if(!_satellite.data.customVars["tutorial mode"]){
        _satellite.data.customVars["tutorial mode"]="Manually Opened"
      }
      _satellite.data.customVars["tutorial"]="Report Suite Select: Refresh an RS"
      _satellite.track("tutorial");     
  } 

  fireAnalytics() {
    _satellite.data.customVars["company"]=this.currentCompany
    this.researchSuites=0
    for (var i = 0; i < this.reportSuites.length; i++) {
      if(this.reportSuites[i].lastUpdated){
        this.researchSuites=this.researchSuites+1
      }
    }
    _satellite.data.customVars["number of RSes"]=this.researchSuites.toString() + "/" + this.listSuites.length.toString() 
    _satellite.data.customVars["page name"]="Report Suite Selection"
    _satellite.track("page view");  
  }

  ionViewWillEnter(StorageServiceProvider) { 
    return this.storage.get("companyData").then(result => {
        if(result){
          this.companyData=result
          this.currentCompany=this.storageService.currentCompany
          this.reportSuites=this.companyData[this.currentCompany].reportSuites ? <Array<Object>> result[this.currentCompany].reportSuites : []
          this.initializeSuites();
          this.numberOfSuites=this.reportSuites.length
          this.fireAnalytics()
        }else{
          this.reportSuites=[]
          this.researchSuites=0
          this.numberOfSuites=0
          this.fireAnalytics() 
        }
      }, error => {
          this.reportSuites=[]
          this.researchSuites=0
          this.numberOfSuites=0
          this.fireAnalytics()
      } 
    );
  }
}
