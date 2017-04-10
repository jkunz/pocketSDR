import {Injectable} from '@angular/core';
import {Http, ConnectionBackend, Request, RequestOptions, RequestOptionsArgs, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class CustomHttp extends Http {
  constructor(backend: ConnectionBackend,
            defaultOptions: RequestOptions,
           ) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<any> {
    console.log('Before the request...');
    return super.request(url, options)
        .catch((err: any): any => {
          console.log(err);
          return Observable.empty();
        })
        .retryWhen(error => error.delay(500))
        .timeout(2000, new Error('delay exceeded'))
        .finally(() => {
          console.log('After the request...');
        });
  }

  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    console.log('Before the request...');
    return super.get(url, options)
        .catch((err: any): any => {
          if (err.status === 400 || err.status === 422) {
            return Observable.throw(err);
          } else {
            console.log(err);
            return Observable.empty();
          }
        })
        .retryWhen(error => error.delay(500))
        .timeout(2000, new Error('delay exceeded'))
        .finally(() => {
          console.log('After the request...');
        });
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    console.log('Before the request...');
    return super.post(url, body, options)
        .catch((err: any): any => {
          if (err.status === 400 || err.status === 422) {
            return Observable.throw(err);
          } else {
            console.log(err);
            return Observable.empty();
          }
        })
        .finally(() => {
          console.log('After the request...');
        });
  }

}