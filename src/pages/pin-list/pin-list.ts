import { Component, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2';

import { PinManager } from '../../shared/services/pin-manager.service';
import { PinDetailPage } from '../pin-detail/pin-detail';

declare var google;

@Component({
  selector: 'page-pin-list',
  templateUrl: 'pin-list.html'
})
export class PinListPage {
  newPin: any = {};
  approvedPins: FirebaseListObservable<any>;
  submittedPins: FirebaseListObservable<any>;
  formExpanded: boolean = false;
  autocomplete: any;
  place: any; // value taken from the chosen autocomplete entry

  constructor(private navController: NavController, private elementRef:ElementRef,
      private pinManager: PinManager) {
  }

  // ngOnInit is problematic. views are cached/loaded once, so it will never get hit again.
  ionViewDidLoad() {
    this.approvedPins = this.pinManager.approvedPins;
    this.submittedPins = this.pinManager.submittedPins;

    const options = {
      types: [],
      componentRestrictions: {country: 'usa'}
     };

    const element = this.elementRef.nativeElement.querySelector('input[name=placeQuery]');
    // console.log('WINDOW GOOGLE', window.google);
    // console.log('WINDOW', window);
    this.autocomplete = new google.maps.places.Autocomplete(element, options);
    google.maps.event.addListener(
        this.autocomplete, 'place_changed', this.onPlaceChanged.bind(this));
  };

  flag(pin: any): void {
    this.pinManager.flag(pin);
    // todo: moderate notifications, allow people to leave a
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
    return false;
  }

  openAddPanel(): void {
    if (!this.formExpanded) {
      this.newPin = {};
      this.place = {};
      this.formExpanded = true;
    }
  }

  cancelForm(event: any): void {
    console.log('canceled');
    this.formExpanded = false;
    console.log('Event', event);
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

  submitForm(): void {
    console.log('submitted');
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
    return false;
  }

  formatDate(dateMillis: any): string {
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

  viewDetail(pinKey: string, isApproved: boolean) {
    this.navController.push(PinDetailPage,
      {
        key: pinKey,
        isApproved
      });
  }
}
