import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

/*
  Generated class for the RandomData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RandomData {

  newData; traktInfo; movieInfo;
  constructor(public http: Http, public storage: Storage) {
    console.log('Hello RandomData Provider');
  }

  getRemoteData(){
    let randomNum = Math.floor(Math.random() * 10);
    return new Promise(resolve => {
        this.http.get('https://www.reddit.com/r/gifs/top/.json?limit=10&sort=hot').map(res => res.json()).subscribe(data => {
        this.newData = data.data.children[randomNum].data;
        resolve(this.newData);
        console.log(this.newData);
      });
    });
  }

  getLocalData(){
    /*return new Promise(resolve => {
        this.http.get('assets/data/randomData.json').map(res => res.json()).subscribe(data => {
          resolve(data);
      });
    }); */
    return this.storage.get("personData");
  }

  setLocalData(data){
    /*
    data = JSON.stringify({
      name: data.name,
      email: data.email,
      address: data.address
    });
    this.http.post('assets/data/randomData.json', data).map(res => res.json()).subscribe(data =>{
      console.log(data);
    });
    */
    this.storage.set("personData", data);
    
  }

  getTraktStuff(){
    if(this.traktInfo){
      return Promise.resolve(this.traktInfo);
    }
    let url = "https://api.trakt.tv/movies/trending";
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('trakt-api-version', '2');
    headers.append('trakt-api-key', '791e06ebaac555fa8e5726c5ba935ba5ecdc6619fe5f9ef44e154991b5df8f78');
    return new Promise(resolve => {
        this.http.get(url, {headers: headers}).map(res => res.json()).subscribe(data => {
        this.traktInfo = (data);
        resolve(this.traktInfo);
      });
    });
  }

  getMovieStuff(id){
    if(this.movieInfo){
      return Promise.resolve(this.movieInfo);
    }
    let url = "https://api.themoviedb.org/3/movie/"+id+"?api_key=9aaf8cb61c24d6a600df17300f8a4302";
    return new Promise(resolve => {
        this.http.get(url).map(res => res.json()).subscribe(data => {
        this.movieInfo = (data);
        resolve(this.movieInfo);;
      });
    });
  }
}
