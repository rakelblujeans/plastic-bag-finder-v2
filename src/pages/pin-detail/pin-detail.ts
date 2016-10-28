import { Component } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import { NavController, NavParams } from 'ionic-angular';

import { googleMapsKey } from '../../shared/google-api-key';
import { PinManager } from '../../shared/services/pin-manager.service';

@Component({
  selector: 'page-pin-detail',
  templateUrl: 'pin-detail.html'
})
export class PinDetailPage {
  pinKey: string;
  pin: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
      private pinManager: PinManager, private domSanitizer : DomSanitizer) {
    this.pinKey = this.navParams.get('key');
    this.isApproved = this.navParams.get('isApproved');
    this.googleMapsKey = googleMapsKey;
  }

  ionViewDidLoad() {
    this.pin = this.pinManager.find(this.pinKey, this.isApproved);
  }

  sanitizeUrl(url: string): any {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
