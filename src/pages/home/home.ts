import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { NavController } from 'ionic-angular';

import { RandomData } from '../../providers/random-data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  passcode; icons; viewable; bgTemp; state;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public dataCtrl: RandomData) {
    this.passcode = "";
    this.icons = [];
    this.viewable = true;
    this.bgTemp = "";
    this.state = "normal";
  }

  add(value, icon){
    if(this.passcode.length < 4){
      this.passcode = this.passcode + value;
      this.icons.push(icon);
      if(this.passcode.length == 4){
          this.checkCode();
        }
      }
  }

  delete(){
    if(this.passcode.length > 0){
      this.passcode = this.passcode.substring(0, this.passcode.length - 1);
      this.icons.pop();
    }
  }

  checkCode(){
    this.dataCtrl.openGate(this.passcode).then(data => {
      if(data == true){
        this.showAlert("Correcte code!", "Treed binnen!");
      }
      else{
        this.showAlert("Verkeerde code!", "Poort zal niet openen. Probeer een andere?");
      }
      this.passcode = "";
      this.icons = [];
    });
  }

  showAlert(newTitle, newDescription) {
    let alert = this.alertCtrl.create({
      title: newTitle,
      subTitle: newDescription,
      buttons: ['OK']
    });
    alert.present();
  }

  toggleView(){
    if(this.viewable == true){
      this.viewable = false;
    }
    else{
      this.viewable = true;
    }
  }

}
