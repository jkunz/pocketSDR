import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { StorageService } from '../services/storage';
import { ApiService } from '../services/api';
import { HttpService } from '../services/http.service';
import { MenuService } from '../services/menu';
import { VarSelectPage } from '../var-select/var-select';

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
  listSuites:any;
  menu:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storageService: StorageService, public httpService:HttpService, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public apiService: ApiService, public events:Events) {
  
  }

  goToRsDetails(rsid){
      this.events.publish('showPage:varList', true);
      this.storageService.currentRS=rsid
      this.storageService.addToStorageSimple("currentRS",rsid)
      this.navCtrl.push(VarSelectPage);
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
        spinner: 'hide',
        content: 'Pulling info from the Adobe API, please wait... (this takes a little longer)'
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
    this.apiService.hitAPI('ReportSuite.GetEvars',params)              
            .subscribe(result => {
                let enabledVariables=[]

                for (var i = 0; i < result[0].evars.length; i++) {
                  if(result[0].evars[i].enabled!=false){
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
                          if(result[0].events[i].type!="disabled" && result[0].events[i].id.indexOf('visit')==-1 && result[0].events[i].id.indexOf('instances')==-1 ){
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

                        let today = new Date();
                        let dd = today.getDate();
                        let mm = today.getMonth()+1; //January is 0!
                        let yyyy = today.getFullYear();
                        if(dd<10){let ddF='0'+dd.toString()}else{let ddF=dd.toString()}
                        if(mm<10){let mmF='0'+mm.toString()}else{let mmF=mm.toString()}
                        let todayF = dd+'/'+mm+'/'+yyyy;

                        this.companyData[this.currentCompany].reportSuites[myIndex].variables=enabledVariables
                        this.companyData[this.currentCompany].reportSuites[myIndex].lastUpdated=todayF

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad RsSelectPage');
  }

  ionViewWillEnter() { 
    return localforage.getItem("companyData").then(result => {
        if(result){
          this.companyData=result
          console.log("company data results on ionViewWill Enter: ")
          console.log(result)
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
