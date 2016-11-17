import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { AdmobManager } from '../shared/services/admob-manager.service';
import { ConnectivityMonitor } from '../shared/services/connectivity-monitor.service';
import { GoogleMapsLoader } from '../shared/services/google-maps-loader.service';
import { PinManager } from '../shared/services/pin-manager.service';
import { UserManager } from '../shared/services/user-manager.service';

import { MyApp } from './app.component';
import { AccountPage } from '../pages/account/account';
import { AuthModalPage } from '../pages/account/auth-modal';
import { MapPage } from '../pages/map/map';
import { PinListPage } from '../pages/pin-list/pin-list';
import { PinDetailPage } from '../pages/pin-detail/pin-detail';
import { TabsPage } from '../pages/tabs/tabs';

// Firebase acts as our database
export const firebaseConfig = {
  apiKey: "AIzaSyDroA4cCNvko84iVfc7mf_GNtqOOWeucIk",
  authDomain: "plastic-bag-finder-1346.firebaseapp.com",
  databaseURL: 'https://plastic-bag-finder-1346.firebaseio.com',
  storageBucket: "plastic-bag-finder-1346.appspot.com"
};

// Use Firebase's anonymous auth sign-in so we can access our db
const firebaseAuthConfig = {
  provider: AuthProviders.Anonymous,
  method: AuthMethods.Anonymous,
}

// Used for Ionic Cloud services. We use it for authentication only so far.
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
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AccountPage,
    AuthModalPage,
    MapPage,
    PinListPage,
    PinDetailPage,
    TabsPage
  ],
  providers: [AdmobManager, ConnectivityMonitor, GoogleMapsLoader, PinManager, UserManager]
})
export class AppModule {}
