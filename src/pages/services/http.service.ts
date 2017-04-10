import {Injectable, EventEmitter} from '@angular/core';
import {Http, Headers, RequestOptions, RequestOptionsArgs, Response, RequestMethod, Request} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import * as Rx from 'rxjs';
import * as wsse from 'wsse-header';

export enum Action { QueryStart, QueryStop };

@Injectable()
export class HttpService {
process: EventEmitter<any> = new EventEmitter<any>();
authFailed: EventEmitter<any> = new EventEmitter<any>();
token:any;
currentUsername:string;
currentSharedSecret:string;

  constructor(private _http: Http) { }

  private _buildAuthHeader(): string {
    return wsse.buildWsseHeader({username: this.currentUsername,passwordEncoded: this.currentSharedSecret}) 
  }

  public get(url: string, options?: RequestOptionsArgs): Rx.Observable<Response> {
    return wsse.buildWsseHeader({username: this.currentUsername,passwordEncoded: this.currentSharedSecret}) 
  }

  public post(url: string, body: string, options?: RequestOptionsArgs): Rx.Observable<Response> {
    return this._request(RequestMethod.Post, url, body, options);
  }

  public put(url: string, body: string, options?: RequestOptionsArgs): Rx.Observable<Response> {
    return this._request(RequestMethod.Put, url, body, options);
  }

  public delete(url: string, options?: RequestOptionsArgs): Rx.Observable<Response> {
    return this._request(RequestMethod.Delete, url, null, options);
  }

  public patch(url: string, body: string, options?: RequestOptionsArgs): Rx.Observable<Response> {
    return this._request(RequestMethod.Patch, url, body, options);
  }

  public head(url: string, options?: RequestOptionsArgs): Rx.Observable<Response> {
    return this._request(RequestMethod.Head, url, null, options);
  }

  private _request(method: RequestMethod, url: string, body?: string, options?: RequestOptionsArgs): Rx.Observable<Response> {
    let requestOptions = new RequestOptions(Object.assign({
      method: method,
      url: url,
      body: body
    }, options));

    if (!requestOptions.headers) {
      requestOptions.headers = new Headers();
    }

    requestOptions.headers.set('Accept', 'application/json, text/javascript, */*; q=0.01');
    requestOptions.headers.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    requestOptions.headers.set('X-WSSE', this._buildAuthHeader())

    return Rx.Observable.create((observer) => {
      this.process.next(Action.QueryStart);
      this._http.request(new Request(requestOptions))
        .finally(() => {
        this.process.next(Action.QueryStop);
      })
        .subscribe(
          (res) => {        
            observer.next(res);
            observer.complete();
          },
          (err) => {
            switch (err.status) {
              case 401:
                //intercept 401
                this.authFailed.next(err);
                observer.error(err);
                break;
              default:
                observer.error(err);
                break;
            }
          }
        )
    })
  }
}