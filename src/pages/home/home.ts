import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import {DetailsPage} from '../details/details';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  passcode; icons; viewable; bgTemp; state;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
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
        if(this.passcode == "2468"){
          console.log("Good Code");
          this.state = "switch";
          this.showAlert("Correct Code!", "The Correct code has been filled in.");
        }
        else{
          console.log("Bad Code");
          this.showAlert("Wrong Code!", "The Wrong code has been filled in.");
        }
      }
    }
    
  }

  delete(){
    if(this.passcode.length > 0){
      this.passcode = this.passcode.substring(0, this.passcode.length - 1);
      this.icons.pop();
    }
  }

  showAlert(newTitle, newDescription) {
    let alert = this.alertCtrl.create({
      title: newTitle,
      subTitle: newDescription,
      buttons: [
      {
        text: 'Ok',
        handler: () => {
          this.passcode = "";
          this.icons = [];
          if(this.state == "switch"){
            //this.viewable = false;
            //this.bgTemp = "matrix.gif";
            this.navCtrl.push(DetailsPage);
          }
        }
      }
    ]
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
