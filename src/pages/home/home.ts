import { Component } from '@angular/core';
import { ToastController, LoadingController } from 'ionic-angular';
import { NavController } from 'ionic-angular';

import { RandomData } from '../../providers/random-data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  passcode; icons; bgTemp; infoToUser; infoToUser2;
  constructor(public navCtrl: NavController, public alertCtrl: ToastController, public dataCtrl: RandomData, public loadCtrl: LoadingController) {
    this.initialize()
  }

  initialize() {
    this.passcode = "";
    this.icons = [];
    this.bgTemp = "gate_1.png";
    this.infoToUser = "Voer je pincode in.";
    this.infoToUser2 = "Ik ben Simsim."
    this.initIcons();
  }

  add(value, icon){
    if(this.passcode.length < 4){
      this.passcode = this.passcode + value;
      switch(this.passcode.length){
        case 1:
          this.icons[0] = icon;
          break;
        case 2:
          this.icons[1] = icon;
          break;
        case 3:
          this.icons[2] = icon;
          break;
        case 4:
          this.icons[3] = icon;
          break;
      }
      if(this.passcode.length == 4){
          this.checkCode(this.passcode);
        }
      }
  }

  delete(){
    if(this.passcode.length > 0){
      this.bgTemp = "gate_1.png";
      this.infoToUser = "Ik ben Simsim.";
      this.infoToUser2 = "Voer je pincode in.";
      this.passcode = this.passcode.substring(0, this.passcode.length - 1);
      for(let i = 4; i > this.passcode.length; i--){
        this.icons[i-1] = "oval.png";
      }
    }
  }

  checkCode(passcode){
    let loader = this.loadCtrl.create({});
    loader.present();
    this.dataCtrl.openGate(passcode).then(data => {
      if(data == true){
        this.showAlert("Correcte code!");
        this.bgTemp = "gate_2.png";
        this.infoToUser = "Treed Binnen!";
        this.infoToUser2 = "Emoji code geaccepteerd";
        setTimeout( () => { this.initialize() }, 3000)
      }
      else{
        this.showAlert("Deze Emoji code is niet bij ons bekend!");
        this.passcode = "";
        this.initIcons();
      }
      loader.dismiss();
    });
  }

  showAlert(newMessage) {
    let alert = this.alertCtrl.create({
      message: newMessage,
      duration: 2000
    });
    alert.present();
  }

  initIcons(){
    for(let i = 0; i < 4; i++){
      this.icons[i] = "oval.png";
    }
  }
}
