import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from 'ionic-angular';

import { PinManager } from '../../shared/services/pin-manager.service';

@Component({
  selector: 'page-pin-list',
  templateUrl: 'pinList.html'
})
export class PinListPage {
  newPin: any = {};
  approvedPins: any;
  submittedPins: any;
  formExpanded: boolean = false;
  autocomplete: any;
  place: any; // string? // value taken from the chosen autocomplete entry

  constructor(public navCtrl: NavController,  private elementRef:ElementRef,
      public pinManager: PinManager) {
    this.pinManager = pinManager;
    // this.placeCtrl = new Control('', Validators.minLength(2));
  }

  ionViewDidLoad() {
    this.approvedPins = this.pinManager.approvedPins;
    this.submittedPins = this.pinManager.submittedPins;

    const options = {
      types: [],
      componentRestrictions: {country: 'usa'}
     };

    const element = this.elementRef.nativeElement.querySelector('input[name=placeQuery]');
    this.autocomplete = new window.google.maps.places.Autocomplete(element, options);
    window.google.maps.event.addListener(
        this.autocomplete, 'place_changed', this.onPlaceChanged.bind(this));
  };

  flag(pin: any): void {
    this.pinManager.flag(pin);
    // todo: moderator notifications, allow people to leave a
    // comment on why they're flagging
  }

  unflag(pin: any): void {
    this.pinManager.unflag(pin);
  }

  remove(pin: any): void {
    this.pinManager.remove(pin);
  }

  approve(pin: any): void {
    this.pinManager.approve(pin);
  }

  unapprove(pin: any): void {
    this.pinManager.unapprove(pin);
  }

  isApproved(pin: any): boolean {
    return this.pinManager.isApproved(pin);
  }

  favorite(pin: any): void {
    // if (user) {
    //   this.pinManager.addToFavorites(pin, user.uid);
    // }
  }

  unfavorite(pin: any): void {
    // if (user) {
    //   this.pinManager.removeFromFavorites(pin, user.uid);
    // }
  }

  isFavorite(pin: any): boolean {
    // if (user) {
    //   return this.pinManager.isFavorite(pin, user.uid);
    // }
  }

  openAddPanel(): void {
    if (!this.formExpanded) {
      this.newPin = {};
      this.place = {};
      this.formExpanded = true;
    }
  }

  cancelForm(event): void {
    this.formExpanded = false;
    event.preventDefault();
    event.stopPropagation();
  }

  onPlaceChanged(): void {
    const place = this.autocomplete.getPlace();
    if (place.geometry) {
      this.place = place;
      // console.log('onPlaceChanged', this.place);
    }
  }

  submitForm(val: any): void {
    if (this.place && this.place.adr_address) {
      this.pinManager.add(this.place);
    }
    this.formExpanded = false;
  }

  isAdmin(): boolean {
    // if (typeof this.admin === undefined) {
    //   this.userManager.isAdmin().then((val) => {
    //     console.log('val', val);
    //     // this.admin =
    //   });
    // }
    // console.log(this.admin);
    // return this.admin;
  }

  formatDate(dateMillis: any): void {
    const date = new Date(dateMillis);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleTimeString('en-us', options);
  }

}
