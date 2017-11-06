import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class StorageServiceProvider {
    currentCompany:any;
    currentUsername:any;
    currentSharedSecret:any;
    currentRS:any;
    currentVar:any;

    companies:any;
    companyData:any;

    tutorial:any;
    shownTutorials:any;
    
    deeplink:any;

	constructor(public events:Events, public storage:Storage){
        this.deeplink=true
        //when the app starts up, pull from storage
        storage.get('tutorial').then((result) => {
			this.tutorial=result?result:false;
		});
        storage.get('currentCompany').then((result) => {
            this.currentCompany=result?result:'';
            if(result && result!=''){this.events.publish('showPage:RSList', true)}
		});
		storage.get('currentRS').then((result) => {
            this.currentRS=result?result:'';
            if(result && result!=''){this.events.publish('showPage:VarList', true)}
		});
		storage.get('currentVar').then((result) => {
			this.currentVar=result?result:'';
            if(result && result!=''){this.events.publish('showPage:VarData', true)}
        });
		storage.get("companies").then(result => this.companies = result ? <Array<Object>> result : []);
		storage.get("shownTutorials").then(result => this.shownTutorials = result ? <Array<Object>> result : []);
		storage.get("companyData").then(result => this.companyData = result ? <Object> result : {});
	}

	addToStorageSimple(name,value){//for simple 1:1 things
		//set to temp storage
		this[name]=value
		//set to longterm storage
        this.storage.set(name,value)
	}

	addToStorageComplex(db,name,value){//for things 1 level down (for instance, "company data" is the highest level object, and we can add things underneath it here, without overwriting the other things underneath it)
        this[db][name]=value
        this.storage.set(db,this[db])
	}
	
	addToStorageArray(name,value){
        this.storage.get(name).then(result => {
            if(result){
                this[name] = result ? <Array<Object>> result : []  
            }else{
                this[name] = []
            }

            this[name].push(value)
            this.storage.set(name,this[name])
            console.log("addToStorageArray:", name, value)
        }, (error) => {
            console.log("ERROR: ", error);
        }

        )
	}
	

}