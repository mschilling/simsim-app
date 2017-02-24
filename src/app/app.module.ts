import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { RandomData } from '../providers/random-data';

// Import the AF2 Module
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyBnJHPWC4SU81BzbVm1lllFT034PVhgTkw",
  authDomain: "m4m-simsim.firebaseapp.com",
  databaseURL: "https://m4m-simsim.firebaseio.com",
  storageBucket: "m4m-simsim.appspot.com",
  messagingSenderId: "148491995129"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RandomData, Storage
    ]
})
export class AppModule {}
