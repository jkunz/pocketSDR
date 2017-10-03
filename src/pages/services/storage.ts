import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';

declare var require: any;
const localforage: LocalForage = require("localforage");

//https://github.com/localForage/localForage and http://localforage.github.io/localForage/

@Injectable()
export class StorageService {
    //COMPANY LIST
    //set the company list
    currentCompany:any;
    currentUsername:any;
    currentSharedSecret:any;
    currentRS:any;
    currentVar:any;


    companies:any;
    companyData:any;

    /*
    currentCompany
    currentUsername
    currentSharedSecret
    currentRS
    currentVar
    
    companies
    companyData   
        [company]
            companyName    
            companyUser
            companySecret
            reportsuites //full suite list
                lastUpdated
                rsid
                site_title
            researchedSuites

    */

    constructor(public events:Events){

        localforage.getItem('currentCompany').then((result) => {
            this.currentCompany=result
            if(result){this.events.publish('showPage:RSList', true)}
        }, (error) => {
            console.log("ERROR: ", error);
        });

        localforage.getItem('currentRS').then((result) => {
            this.currentRS=result
            if(result){this.events.publish('showPage:VarList', true)}
        }, (error) => {
            console.log("ERROR: ", error);
        });

        localforage.getItem('currentVar').then((result) => {
            this.currentCompany=result
            if(result){this.events.publish('showPage:varData', true)}
        }, (error) => {
            console.log("ERROR: ", error);
        });


        console.log("storageService controller setting companies")
        this.companies=localforage.getItem("companies").then(result => this.companies = result ? <Array<Object>> result : []);
        this.companyData=this.readStorage("companyData")
        this.currentVar=this.readStorage("currentVar")

    }

     convert2Array(val) {
         return Array.from(val);
     }

    addToStorageSimple(name,value){
        this[name]=value
        localforage.setItem(name,value)
    }

    addToStorageArray(name,value){
        localforage.getItem(name).then(result => {
            if(result){
                this[name] = result ? <Array<Object>> result : []  
            }else{
                this[name] = []
            }

            this[name].push(value)
            localforage.setItem(name,this[name])
        }, (error) => {
            console.log("ERROR: ", error);
        }

        )
    }

    addToStorageComplex(db,name,value){
        this[db][name]=value
        localforage.setItem(db,this[db])
    }

    readStorage(name){
        let returnedData={};
        localforage.getItem(name).then((result) => {
            returnedData = result ? <Array<Object>> result : [];
        }, (error) => {
            console.log("ERROR: ", error);
        });
        return returnedData
    }

    //TO-DO: needs more work/validation
    deleteFromStorage(name,item){
        let returnedData={}
        localforage.getItem(name).then((result) => {
            returnedData = result ? <Array<Object>> result : [];
            console.log("returnedData: ")
            console.log(returnedData)
            //local
            //returnedData.remove(item)
        }, (error) => {
            console.log("ERROR: ", error);
        });
    }

}   