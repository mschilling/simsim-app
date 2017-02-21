import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { DetailsPage } from '../pages/details/details';
import { RandomData } from '../providers/random-data';
import { ApiPagePage} from '../pages/api-page/api-page';
import { AccountPage } from '../pages/account/account';
import { TutorialPage } from '../pages/tutorial/tutorial';

import { Storage } from '@ionic/storage';

export function provideStorage() {
  return new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__mydb' });
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DetailsPage,
    ApiPagePage,
    AccountPage,
    TutorialPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DetailsPage,
    ApiPagePage,
    AccountPage,
    TutorialPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: Storage, useFactory: provideStorage},
    RandomData, Storage
    ]
})
export class AppModule {}
