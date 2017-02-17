import { Component } from '@angular/core';
import { NavController, MenuController, LoadingController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { RandomData } from '../../providers/random-data';


@Component({
  selector: 'page-home',
  templateUrl: 'details.html'
})
export class DetailsPage {
  source;
  traktInfo;
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public menuCtrl: MenuController, public dataCtrl: RandomData) {
    this.menuCtrl.enable(true);
  }
  public event = {
    month: '1990-02-19',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
    Geolocation.getCurrentPosition().then(pos => {
      console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
    });
  }

  popToRoot(){
    this.navCtrl.popToRoot();
  }

  getNewImage(){
    console.log("click");
    this.source = this.dataCtrl.getRemoteData();
  }

  getTraktStuff(){
    this.traktInfo = this.dataCtrl.getTraktStuff();
    console.log("clickerdieclick");
  }

}
