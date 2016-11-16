import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2';

import { PinManager } from '../../shared/services/pin-manager.service';
import { UserManager } from '../../shared/services/user-manager.service';
import { PinDetailPage } from '../pin-detail/pin-detail';

declare var google;

@Component({
  selector: 'page-pin-list',
  templateUrl: 'pin-list.html'
})
export class PinListPage {
  @ViewChild('fakeMap') fakeMapEl: ElementRef;
  // Locations approved by a moderator
  approvedPins: FirebaseListObservable<any>;
  // Locations submitted but still awaiting approval
  submittedPins: FirebaseListObservable<any>;
  // Is the form used for entering new locations currently visible?
  formExpanded: boolean = false;
  // Value taken from the vetted autocomplete entry. Contains complete set of place details
  place: any;
  // Has the selected entry been vetted?
  isPlaceSubmitable: boolean = false;
  // Options returned by Google's autocomplete service
  predictions: Array<any> = [];
  // Contains the value display inside our searchbar's textbox
  autocomplete = {
    query: ''
  }
  user: any;
  userIsAdmin: boolean;
  errorMsg: string = null;

  constructor(private navController: NavController, private elementRef:ElementRef,
      private zone: NgZone, private pinManager: PinManager, private platform: Platform,
      private userManager: UserManager) {
    platform.ready().then(() => {
      this.approvedPins = this.pinManager.approvedPins;
      this.submittedPins = this.pinManager.submittedPins;

      this.user = this.userManager.getCurrentUser();
      if (this.user) {
        this.userIsAdmin = this.userManager.isAdmin();
      }
    });
  }

  updateSearch() {
    this.errorMsg = null;

    const service = new google.maps.places.AutocompleteService();
    if (this.autocomplete.query === '') {
      this.predictions = [];
      return;
    }

    service.getPlacePredictions({
      input: this.autocomplete.query,
      componentRestrictions: {
        country: 'us'
      }
    }, (predictions, status) => {
      this.zone.run(() => {
        // console.log(predictions);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.predictions = predictions
        }
      });
    });
  }

  onPlaceClicked(place) {
    // console.log('onPlaceClicked', place.place_id);
    if (!place || !place.place_id) {
      // console.log('Error: No place or place_id found');
      return;
    }

    const service = new google.maps.places.PlacesService(this.fakeMapEl.nativeElement);
    service.getDetails({
      placeId: place.place_id
    }, (place, status) => {
      this.zone.run(() => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.place = place;
          // we've clicked on a valid autocomplete option, so we can now save this entry
          this.isPlaceSubmitable = true;
        }

        // update input textbox
        this.autocomplete.query = this.place.formatted_address;
        // clear autocompleted list
        this.predictions = [];
      });
    });
  }

  openAddPanel(): void {
    if (!this.formExpanded) {
      this.place = {};
      this.autocomplete.query = '';
      this.formExpanded = true;
      this.isPlaceSubmitable = false;
    }
  }

  cancelForm(event: any): void {
    this.errorMsg = null;
    // console.log('canceled');
    this.formExpanded = false;
    // console.log('Event', event);
    event.preventDefault();
    event.stopPropagation();
  }

  submitForm(): void {
    this.errorMsg = null;
    // console.log('submitted', this.place);
    if (this.place && this.place.adr_address) {
      const succeeded = this.pinManager.add(this.place);
      if (succeeded) {
        this.formExpanded = false;
      } else {
        this.errorMsg = 'Error saving. Address must be unique.'
      }
    }
  }

  flag(pin: any): void {
    this.pinManager.flag(pin);
    // TODO: Moderate notifications, allow people to leave a
    // comment on why they're flagging
  }

  unflag(pin: any): void {
    this.pinManager.unflag(pin);
  }

  remove(pin: any): void {
    // console.log('remove', pin);
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
    this.user && this.pinManager.addToFavorites(pin, this.user, this.userManager);
  }

  unfavorite(pin: any): void {
    this.user && this.pinManager.removeFromFavorites(pin, this.user, this.userManager);
  }

  isFavorite(pin: any): boolean {
    return this.user && this.pinManager.isFavorite(pin, this.user);
  }

  isAdmin(): boolean {
    return this.userManager.isAdmin();
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
