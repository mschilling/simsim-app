import { Component } from '@angular/core';
import { NavController, MenuController, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { RandomData } from '../../providers/random-data';

import { ApiPagePage } from '../api-page/api-page';


@Component({
  selector: 'page-home',
  templateUrl: 'details.html',
  providers: [RandomData]
})
export class DetailsPage {
  source; traktInfo; localData; geoData = {lat: 0, lon: 0};
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public menuCtrl: MenuController, public dataCtrl: RandomData, public toastCtrl: ToastController) {
    this.menuCtrl.enable(true);
  }

  presentLoading() {
    let loader = this.toastCtrl.create({
      message: "Getting Location..."
    });
    loader.present();
    Geolocation.getCurrentPosition().then(pos => {
      this.geoData.lat = pos.coords.latitude;
      this.geoData.lon = pos.coords.longitude;
      loader.dismiss();
    });
  }

  getNewImage(){
    let loader = this.toastCtrl.create({
      message: "Loading image"
    });
    loader.present();
    this.dataCtrl.getRemoteData().then(data => {
      this.source = data;
      loader.dismiss();
    });
  }

  openTraktPage(){
    this.navCtrl.push(ApiPagePage);
  }

}
