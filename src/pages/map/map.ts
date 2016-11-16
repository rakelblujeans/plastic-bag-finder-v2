import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform } from 'ionic-angular';

import { PinMap } from '../../shared/services/pin-map.service';
import { UserManager } from '../../shared/services/user-manager.service';

declare let AdMob: any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  providers: [PinMap]
})

export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  private admobId: any;

  constructor(private pinMap: PinMap, private platform: Platform,
      private userManager: UserManager) {

    if(/(android)/i.test(navigator.userAgent)) {
      console.log('1111');
      this.admobId = {
        banner: 'ca-app-pub-5492841865644941/6614560117' // plastic-bag-recycler-banner
      };
    } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
      console.log('2222');
      this.admobId = {
        banner: 'ca-app-pub-5492841865644941/3521492910' // plastic-bag-recycler-banner-ios
      };
    }

    // ionViewDidLoad works ok when testing in the browser, but when running on device it's not
    // sufficient. Since we are using native plugins we must wait until the device is ready
    // before calling out to them.
    platform.ready().then(() => {
      this.pinMap.loadMap(this.mapElement.nativeElement, this.userManager.getCurrentUser());
      this.createBanner();
    });
  }

  createBanner() {
      if (this.admobId && AdMob) {
        AdMob.createBanner({
          adId: this.admobId.banner,
          isTesting: true,
          position:AdMob.AD_POSITION.BOTTOM_CENTER,
        });
      }
  }

  // showInterstitial() {
  //   this.platform.ready().then(() => {
  //     if (this.admobId && AdMob) {
  //       AdMob.prepareInterstitial({
  //         adId: this.admobId.interstitial,
  //         autoShow: true
  //       });
  //     }
  //   });
  // }

  showBanner(position) {
    if (this.admobId && AdMob) {
      const positionMap = {
        bottom: AdMob.AD_POSITION.BOTTOM_CENTER,
        top: AdMob.AD_POSITION.TOP_CENTER
      };
      AdMob.showBanner(positionMap[position.toLowerCase()]);
    }
  }

  // hideBanner(position) {
  //   this.platform.ready().then(() => {
  //     if (this.admobId && AdMob) {
  //       AdMob.hideBanner();
  //     }
  //   });
  // }
}
