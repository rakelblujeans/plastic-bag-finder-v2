import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { AngularFireModule } from 'angularfire2'; // AuthProviders, AuthMethods

import { ConnectivityMonitor } from '../shared/services/connectivity-monitor.service';
import { GoogleMapsLoader } from '../shared/services/google-maps-loader.service';
import { PinManager } from '../shared/services/pin-manager.service';
import { UserManager } from '../shared/services/user-manager.service';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AccountPage } from '../pages/account/account';
import { AuthModalPage } from '../pages/account/auth-modal';
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

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'e0e05f46'
  },
  'auth': {
    'google': {
      'webClientId': '635356205993-r9sq4cv4pp6io3uopk95h56b7tdc0l4c.apps.googleusercontent.com'
    }
  }
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AccountPage,
    AuthModalPage,
    MapPage,
    PinListPage,
    PinDetailPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AccountPage,
    AuthModalPage,
    MapPage,
    PinListPage,
    PinDetailPage,
    TabsPage
  ],
  providers: [ConnectivityMonitor, GoogleMapsLoader, PinManager, UserManager]
})
export class AppModule {}
