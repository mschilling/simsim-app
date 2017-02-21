import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RandomData } from '../../providers/random-data';

@Component({
  selector: 'page-api-page',
  templateUrl: 'api-page.html',
  providers: [RandomData]
})
export class ApiPagePage {
  traktInfo; movieInfo; count;
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataCtrl: RandomData) {
    this.getTraktStuff();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ApiPagePage');
  }

  getTraktStuff(){
    this.dataCtrl.getTraktStuff().then(data => {
      this.traktInfo = data;
      this.getMovieStuff(data);
    });
  }

  getMovieStuff(data){
    this.count = 0;
    data.forEach(element => {
      this.dataCtrl.getMovieStuff(element.movie.ids.tmdb).then(data => {
        element.tmdb = data;
        this.count++;
      });
    });
  }
}
