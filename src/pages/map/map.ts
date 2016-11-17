import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform } from 'ionic-angular';

import { AdmobManager } from '../../shared/services/admob-manager.service';
import { PinMap } from '../../shared/services/pin-map.service';
import { UserManager } from '../../shared/services/user-manager.service';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  providers: [PinMap]
})

export class MapPage {
  @ViewChild('map') mapElement: ElementRef;

  constructor(private pinMap: PinMap, private platform: Platform,
      private admobManager: AdmobManager, private userManager: UserManager) {

    // ionViewDidLoad works ok when testing in the browser, but when running on device it's not
    // sufficient. Since we are using native plugins we must wait until the device is ready
    // before calling out to them.
    platform.ready().then(() => {
      this.pinMap.loadMap(this.mapElement.nativeElement, this.userManager.getCurrentUser());
      this.admobManager.createBanner();
    });
  }


}
