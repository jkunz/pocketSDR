import 'rxjs/add/operator/map';
import { Injectable }     from '@angular/core';
import { HttpService } from './http.service';


@Injectable()
export class ApiService {
    constructor(private http: HttpService){

    }
  

    hitAPI(method, params){
        let url = 'https://api.omniture.com/admin/1.4/rest/?method='+method;
        let body = params;
        return this.http.post(url, body)
            .map(res => res.json())
    }
}