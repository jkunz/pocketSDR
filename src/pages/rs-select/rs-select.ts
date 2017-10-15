import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events, Nav } from 'ionic-angular';
import { StorageService } from '../services/storage';
import { ApiService } from '../services/api';
import { HttpService } from '../services/http.service';
import { TabsPage } from '../tabs/tabs';

declare var require: any;
const localforage: LocalForage = require("localforage");

@Component({
  selector: 'page-rs-select',
  templateUrl: 'rs-select.html'
})
export class RsSelectPage {
  reportSuites:any;
  companyData:any;
  currentCompany:any;
  shownTutorials:any;
  listSuites:any;
  menu:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public nav:Nav, public storageService: StorageService, public httpService:HttpService, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public apiService: ApiService, public events:Events) {
        this.shownTutorials=localforage.getItem("shownTutorials").then(result => {
        this.shownTutorials = result ? <Object> result : {}
        if(this.storageService.tutorial==true && !this.shownTutorials.includes("RSselect")){
          this.storageService.addToStorageArray("shownTutorials","RSselect")
          this.showTutorial()
        }
      });
  }

  goToRsDetails(rsid){
      this.events.publish('showPage:varList', true);
      this.storageService.currentRS=rsid
      this.storageService.addToStorageSimple("currentRS",rsid)
      this.navCtrl.parent.select(2); //parent is the tabs page; it's the 3rd in the array ("2" in javascript terms)
      this.nav.setRoot(TabsPage, { index: 2 });//parent is the tabs page; it's the 3rd in the array ("2" in javascript terms)
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
      this.pullRS(rsid)
    }

  }

  pullRS(rsid){ 
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

    this.httpService.currentUsername=this.companyData[this.currentCompany].companyUsername;
    this.httpService.currentSharedSecret=this.companyData[this.currentCompany].companySecret;

    var params = {
          "rsid_list":[
            rsid
          ]
        }

    console.log("rsid:" + rsid) 

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
                console.log("variable returns:")
                console.log(enabledVariables)

                this.apiService.hitAPI('ReportSuite.GetProps',params)   
                  .subscribe(result => {
                    for (var i = 0; i < result[0].props.length; i++) {
                        enabledVariables.push(result[0].props[i])
                    }
                    console.log(enabledVariables)
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
                        console.log(enabledVariables)
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

                        console.log("companyData with RS vars")
                        console.log(this.companyData[this.currentCompany])

                        this.storageService.addToStorageComplex("companyData",this.currentCompany,this.companyData[this.currentCompany])

                        loading.dismiss();
                        this.goToRsDetails(rsid)

                      }
                    )
                  }
                )
                this.companyData[this.currentCompany].researchedSuites.push(rsid)
              


            }, error => {
                loading.dismiss();
                alert.present();
            }); 

  }

  refreshItem(rsid){
    this.pullRS(rsid)
  }

  initializeSuites() {
    this.listSuites = this.reportSuites
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeSuites();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.listSuites = this.listSuites.filter((item) => {
        console.log(JSON.stringify(item).toLowerCase())
        return (JSON.stringify(item).toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  showTutorial(){
    console.log("showTutorial opened")
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
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad RsSelectPage');
  }

  ionViewWillEnter() { 
    return localforage.getItem("companyData").then(result => {
        if(result){
          this.companyData=result
          console.log("company data results on ionViewWill Enter",result)
          console.log("company data currentCompany", this.storageService.currentCompany)
          this.currentCompany=this.storageService.currentCompany
          this.reportSuites=this.companyData[this.currentCompany].reportSuites ? <Array<Object>> result[this.currentCompany].reportSuites : []
          this.initializeSuites();
        }else{
          this.reportSuites=[]
        }
      }, error => {
          this.reportSuites=[]
      }    
    );
  }
}
