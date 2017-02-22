import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RandomData {

  newData; traktInfo; movieInfo;
  constructor(public http: Http) {

  }

  openGate(pinCode){
    let data = JSON.stringify({
      pin: pinCode
    });
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    return new Promise(resolve => {
      this.http.post('https://api.michaelschilling.com/gate/open', data, { headers: headers }).subscribe(response => {
        resolve(true);
      }, error => {
        resolve(false);
      });
    })

  }
}
