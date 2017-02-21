import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { RandomData } from '../../providers/random-data';

/*
  Generated class for the Account page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  localData;
  newData = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public dataCtrl: RandomData, public toastCtrl: ToastController) {
    this.getLocalData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
  }

  getLocalData(){
    /*
    this.dataCtrl.getLocalData().then(data => {
      this.localData = data;
      console.log(this.localData);
    })
    */
    this.localData = this.dataCtrl.getLocalData().then(data =>{
      this.localData = data;
    });
  }

  setLocalData(){
    this.dataCtrl.setLocalData(this.newData);
    let loader = this.toastCtrl.create({
      message: "New data saved...",
      duration: 1000
    });
    loader.present();
  }

}
