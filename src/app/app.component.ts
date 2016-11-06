import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { AngularFire } from 'angularfire2';

import { TabsPage } from '../pages/tabs/tabs';
import { ConnectivityMonitor } from '../shared/services/connectivity-monitor.service';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  providers: [ConnectivityMonitor]
})
export class MyApp {
  rootPage = TabsPage; // specifies what page loads first

  constructor(private platform: Platform, private af: AngularFire,
    private connectivityMonitor: ConnectivityMonitor) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      connectivityMonitor.startWatching();
      // Authenticate with our Firebase backend
      af.auth.login();
    });
  }
}
