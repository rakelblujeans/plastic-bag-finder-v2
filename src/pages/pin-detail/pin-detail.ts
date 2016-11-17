import { Component } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import { NavController, NavParams, Platform } from 'ionic-angular';

import { googleMapsKey } from '../../shared/google-api-key';
import { PinManager } from '../../shared/services/pin-manager.service';
import { UserManager } from '../../shared/services/user-manager.service';

@Component({
  selector: 'page-pin-detail',
  templateUrl: 'pin-detail.html'
})
export class PinDetailPage {
  pin: any = {};
  pinKey: string;
  isApproved: boolean = false;
  googleMapsKey: string = '';
  mapUrl: string = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
      private domSanitizer : DomSanitizer, private pinManager: PinManager,
      private platform: Platform, private userManager: UserManager) {
    this.pinKey = this.navParams.get('key');
    this.isApproved = !!this.navParams.get('isApproved');
    this.pin = this.navParams.get('pin');
    this.googleMapsKey = googleMapsKey;

    platform.ready().then(() => {
      this.setup();
    });
  }

  // data doesn't change here, so we don't need to update
  // ionViewWillEnter() {
    // this.setup();
  // }

  setup() {
    // trigger a preload of user data
    this.userManager.getCurrentUser();
    // console.log(this.pin);
    if (this.pin) {
      return;
    }

    this.pinManager.find(this.pinKey, this.isApproved).subscribe((snapshot) => {
      if (!this.pin.placeId && snapshot.val()) {
        this.pin = snapshot.val();
        this.mapUrl = this.sanitizeUrl('https://www.google.com/maps/embed/v1/place?q=place_id:' +
            this.pin.placeId + '&key=' + googleMapsKey);
        // TODO: no way to unsubscribe right now...
      }
    });
  }

  sanitizeUrl(url: string): any {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
