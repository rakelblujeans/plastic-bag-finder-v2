import { Component } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import { NavController, NavParams } from 'ionic-angular';

import { googleMapsKey } from '../../shared/google-api-key';
import { PinManager } from '../../shared/services/pin-manager.service';
import { UserManager } from '../../shared/services/user-manager.service';

@Component({
  selector: 'page-pin-detail',
  templateUrl: 'pin-detail.html'
})
export class PinDetailPage {
  pin: any;
  pinKey: string;
  isApproved: boolean = false;
  googleMapsKey: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams,
      private domSanitizer : DomSanitizer, private pinManager: PinManager,
      private userManager: UserManager) {
    this.pinKey = this.navParams.get('key');
    this.isApproved = this.navParams.get('isApproved');
    this.googleMapsKey = googleMapsKey;
  }

  ionViewWillEnter() {
    this.pin = this.pinManager.find(this.pinKey, this.isApproved);
    // trigger a preload of user data
    this.userManager.getCurrentUser();
  }

  sanitizeUrl(url: string): any {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
