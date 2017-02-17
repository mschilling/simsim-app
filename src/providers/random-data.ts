import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the RandomData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RandomData {

  newData; traktInfo;
  constructor(public http: Http) {
    console.log('Hello RandomData Provider');
  }

  getRemoteData(){
    let randomNum = Math.floor(Math.random() * 10);
    this.http.get('https://www.reddit.com/r/gifs/top/.json?limit=10&sort=hot').map(res => res.json()).subscribe(data => {
      this.newData = data.data.children[randomNum].data.preview.images[0].variants.gif.source.url;
    });
    return this.newData;
  }

  getLocalData(){
    this.http.get('assets/data/randomData.json').map(res => res.json()).subscribe(data => {
      console.log(data.batters.batter[0].type);
    });
  }

  getTraktStuff(){
    let url = "https://api.trakt.tv/movies/trending";
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('trakt-api-version', '2');
    headers.append('trakt-api-key', '791e06ebaac555fa8e5726c5ba935ba5ecdc6619fe5f9ef44e154991b5df8f78');
    this.http.get(url, {headers: headers}).map(res => res.json()).subscribe(data => {
      this.traktInfo = (data);
    });
    return this.traktInfo;
  }

}
