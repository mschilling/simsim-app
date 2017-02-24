import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {AngularFire} from 'angularfire2';

@Injectable()
export class RandomData {

  newData; traktInfo; movieInfo;
  constructor(public http: Http, public af: AngularFire) { }

  openGate(pinCode){
    return new Promise(resolve => {
      this.af.database.list('gate/open').push({ code: pinCode })
        .then( () => resolve(true))
        .catch( () => resolve(false))
    })
  }
}
