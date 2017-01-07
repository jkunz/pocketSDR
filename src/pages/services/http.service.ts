import {Injectable} from '@angular/core';
import {Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as wsse from 'wsse-header';

@Injectable()
export class HttpService extends Http {
token:any;

  constructor (backend: XHRBackend, options: RequestOptions) {
    let credentials={
      username:"jkunz:Jennifer Kunz",
      passwordEncoded:"ee9be22adfd8f4db4c3570784e55845d"
    } 
    let token = wsse.buildWsseHeader(credentials) // your custom token getter function here
    options.headers.set('X-WSSE', `${token}`);
    options.headers.set('Accept', 'application/json, text/javascript, */*; q=0.01');
    options.headers.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    super(backend, options);
    this.token=token;
  }
 
  request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {
      if (!options) {
        // let's make option object
        options = {headers: new Headers()};
      }
      options.headers.set('X-WSSE', `${this.token}`);
      console.log("pulled from options")
    return super.request(url, options).catch(this.catchAuthError(this));
  }

  private catchAuthError (self: HttpService) {
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      console.log(res);
      if (res.status === 401 || res.status === 403) {
        // if not authenticated
        console.log(res);
      }
      return Observable.throw(res);
    };
  }
}