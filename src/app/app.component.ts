import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { ConnectivityMonitor } from '../shared/services/connectivity-monitor.service';
import { GoogleMapsLoader } from '../shared/services/google-maps-loader.service';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  providers: [ConnectivityMonitor, GoogleMapsLoader]
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform, private connectivityMonitor: ConnectivityMonitor) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      connectivityMonitor.startWatching();
    });
  }
}
