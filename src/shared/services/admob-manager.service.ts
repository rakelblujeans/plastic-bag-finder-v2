import { Injectable } from '@angular/core';

/**
 * Note: All functions in this class must be called after platform.ready().
 */

declare let AdMob: any;

@Injectable()
export class AdmobManager {
  private admobId: any;

  constructor() {

  }

  setIds() {
    if(/(android)/i.test(navigator.userAgent)) {
      this.admobId = {
        banner: 'ca-app-pub-5492841865644941/6614560117' // plastic-bag-recycler-banner
      };
    } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
      this.admobId = {
        banner: 'ca-app-pub-5492841865644941/3521492910' // plastic-bag-recycler-banner-ios
      };
    }
  }

  createBanner(): void {
      if (this.admobId && AdMob) {
        this.setIds();
        AdMob.createBanner({
          adId: this.admobId.banner,
          // isTesting: true,
          position:AdMob.AD_POSITION.BOTTOM_CENTER,
        });
      }
  }

  // showInterstitial(): void {
  //   this.platform.ready().then(() => {
  //     if (this.admobId && AdMob) {
  //       AdMob.prepareInterstitial({
  //         adId: this.admobId.interstitial,
  //         autoShow: true
  //       });
  //     }
  //   });
  // }

  showBanner(position: any): void {
    if (this.admobId && AdMob) {
      const positionMap = {
        bottom: AdMob.AD_POSITION.BOTTOM_CENTER,
        top: AdMob.AD_POSITION.TOP_CENTER
      };
      AdMob.showBanner(positionMap[position.toLowerCase()]);
    }
  }

  // hideBanner(position: any): void {
  //   this.platform.ready().then(() => {
  //     if (this.admobId && AdMob) {
  //       AdMob.hideBanner();
  //     }
  //   });
  // }
}
