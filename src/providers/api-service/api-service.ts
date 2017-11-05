import {Injectable, EventEmitter} from '@angular/core';
import {Http, Headers, RequestOptions, RequestOptionsArgs, Response, RequestMethod, Request} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

declare var require: any;

@Injectable()

export class ApiServiceProvider {
    process: EventEmitter<any> = new EventEmitter<any>();
    authFailed: EventEmitter<any> = new EventEmitter<any>();
    token:any;
    currentUsername:string;
    currentSharedSecret:string;  

  constructor(public http: Http,) {

  }

  hitAPI(method, params){
    //uses https://www.npmjs.com/package/wsse   
    //follows mediocre adobe specs at https://marketing.adobe.com/developer/documentation/genesis/c-overview-rest 
    let wsse = require('wsse');
    let token = new wsse.UsernameToken({
      username: this.currentUsername,            // (required) 
      password: this.currentSharedSecret,       // (required) 
      //nonce: 'd36e316282959a9ed4c89851497a717f', // (optional) you can specify `nonce`. 
      //sha1encoding: 'hex'                        // (optional) you can specify `sha1encoding` for wrong WSSE Username Token implementation. 
    });
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    headers.append('Accept', 'application/json, text/javascript, */*; q=0.01')
    headers.append('X-WSSE', token.getWSSEHeader({nonceBase64: true}) )

    let options = new RequestOptions({ headers: headers });

    let url = 'https://api.omniture.com/admin/1.4/rest/?method='+method;
    let body = params;
    return this.http.post(url, body, options)
        .map(res => res.json())
  }

}
