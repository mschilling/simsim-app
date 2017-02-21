import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';
import { DetailsPage } from '../pages/details/details';
import { ApiPagePage } from '../pages/api-page/api-page';
import { AccountPage } from '../pages/account/account';
import { TutorialPage } from '../pages/tutorial/tutorial';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage = HomePage;
  activePage;
  pages: Array<{title: string, component: any}>;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
    this.pages = [
      {title: "Login", component: HomePage},
      {title: "Details", component: DetailsPage},
      {title: "API", component: ApiPagePage},
      {title: "Account", component: AccountPage},
      {title: "Tutorial", component: TutorialPage}
    ];
    this.activePage = this.pages[1];
  }

  openPage(page){
    this.nav.setRoot(page.component);
    this.activePage = page;
  }

  checkActive(page){
    return page == this.activePage;
  }
}
