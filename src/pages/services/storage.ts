import { NativeStorage } from 'ionic-native';

export class StorageService {

    //COMPANY LIST
    //set the company list
    companies:string[];
    tempCompany:string;
    tempUsername:string;
    tempSharedSecret:string;

    constructor(){
        //for dev:
        this.companies=['company1','company2'];

        //for prod:
        //this.companies=this.readStorage('companies')
    }

    readStorage(readList){
        let varHolder=this[readList];
        NativeStorage.getItem(readList).then((d)=>{
            console.log('retrieved ' + readList + ' list',d);
            varHolder=JSON.parse(d)
        },(e)=>{
            console.log('unable to retrieve ' + readList + ' list',e);
        });
        return varHolder
    }

    addToStorage(addTo,addedItem){
        let varHolder=[this[addTo]];
        NativeStorage.getItem(addTo).then((d)=>{
            varHolder=JSON.parse(d);
            console.log('retrieved ' + addTo + ' list',d);
        },(e)=>{
            console.log('unable to retrieve ' + addTo + ' list',e);
        });

        varHolder.push(addedItem)
        this[addTo]=varHolder

        NativeStorage.setItem(addTo,JSON.stringify(varHolder)).then((d)=>{
            console.log('added ' + addedItem + ' to ' + addTo + ' list',d);
        },(e)=>{
            console.log('unable to add ' + addedItem + ' to ' + addTo + ' list',e);
        })

    }

    deleteFromStorage(deleteFrom,deletedItem){
        let varHolder=this.readStorage(deleteFrom);

        var index = this.companies.indexOf(deletedItem, 0);
        if (index > -1) {
            varHolder.splice(index, 1);
        };
        this[deleteFrom]=varHolder

        NativeStorage.setItem(deleteFrom,JSON.stringify(varHolder)).then((d)=>{
            console.log('updated ' + deleteFrom + ' list',d);
        },(e)=>{
            console.log('unable to update ' + deleteFrom + ' list',e);
        });


    }
}          
