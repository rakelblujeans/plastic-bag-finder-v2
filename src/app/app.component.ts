import { Component } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { ConnectivityMonitor } from '../shared/services/connectivity-monitor.service';
import { GoogleMapsLoader } from '../shared/services/google-maps-loader.service';
import { PinManager } from '../shared/services/pin-manager.service';
import { UserManager } from '../shared/services/user-manager.service';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  providers: [ConnectivityMonitor, GoogleMapsLoader, PinManager, UserManager, NavController]
})
export class MyApp {
  rootPage = TabsPage; // specifies what page loads first

  constructor(platform: Platform, private connectivityMonitor: ConnectivityMonitor) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      connectivityMonitor.startWatching();
    });
  }
}
