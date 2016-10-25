import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AccountPage } from '../pages/account/account';
import { MapPage } from '../pages/map/map';
import { PinListPage } from '../pages/pinList/pinList';
import { TabsPage } from '../pages/tabs/tabs';

import { AngularFireModule } from 'angularfire2';

export const firebaseConfig = {
  apiKey: "AIzaSyDroA4cCNvko84iVfc7mf_GNtqOOWeucIk",
  authDomain: "plastic-bag-finder-1346.firebaseapp.com",
  databaseURL: 'https://plastic-bag-finder-1346.firebaseio.com',
  storageBucket: "plastic-bag-finder-1346.appspot.com"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AccountPage,
    MapPage,
    PinListPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AccountPage,
    MapPage,
    PinListPage,
    TabsPage
  ],
  providers: []
})
export class AppModule {}
