import { NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms';
import { IonicApp, IonicModule } from 'ionic-angular';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AccountPage } from '../pages/account/account';
import { MapPage } from '../pages/map/map';
import { PinListPage } from '../pages/pin-list/pin-list';
import { PinDetailPage } from '../pages/pin-detail/pin-detail';
import { TabsPage } from '../pages/tabs/tabs';

export const firebaseConfig = {
  apiKey: "AIzaSyDroA4cCNvko84iVfc7mf_GNtqOOWeucIk",
  authDomain: "plastic-bag-finder-1346.firebaseapp.com",
  databaseURL: 'https://plastic-bag-finder-1346.firebaseio.com',
  storageBucket: "plastic-bag-finder-1346.appspot.com"
};

const firebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.OAuthToken,
  remember: 'default'
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AccountPage,
    MapPage,
    PinListPage,
    PinDetailPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AccountPage,
    MapPage,
    PinListPage,
    PinDetailPage,
    TabsPage
  ],
  providers: []
})
export class AppModule {}
