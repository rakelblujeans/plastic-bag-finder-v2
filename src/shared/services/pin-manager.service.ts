import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

enum Status {
  SUBMITTED,
  APPROVED,
  FLAGGED
};

// TODO: limit by proximity to me?
// TODO: pagination?

@Injectable()
export class PinManager {
  submittedPins: FirebaseListObservable<any>;
  approvedPins: FirebaseListObservable<any>;
  addresses: any = [];

  constructor(private af: AngularFire) {
    this.approvedPins = this.af.database.list('/pins/approved');
    this.submittedPins = this.af.database.list('/pins/submitted');

    this.af.database.object('/addresses', {preserveSnapshot: true})
        .subscribe((snapshots) => {
          this.addresses.length = 0;
          snapshots.forEach((snapshot) => {
            this.addresses.push(snapshot.key);
          });
      });
  }

  // Each pin must be considered 'unique' in order to add successfully.
  // Returns a boolean indicating success
  add(place: any): boolean {
    const newPin = {address: null};
    this.setData(newPin, place);
    if (newPin.address !== '' && newPin.address !== null) {
      let found = this.addresses.some((address) => address === newPin.address);
      if (!found) {
        this.submittedPins.push(newPin);
        this.af.database.object('/addresses/' + newPin.address).set({taken: true});
        return true;
      }
    }

    return false;
  }

  remove(pin: any): void {
    this.af.database.object('/addresses/' + pin.address).remove();
    if (pin.status === Status.APPROVED) {
      this.approvedPins.remove(pin.$key);
    } else if (pin.status === Status.SUBMITTED) {
      this.submittedPins.remove(pin.$key);
    }
  }

  /** In practice, we should never need this. The only updates
  * someone would make is to flag this place as no longer accepting donations,
  * otherwise they will leave comments. Anything else should be brought up to the
  * moderators attention.
  */
  update(pin: any, place: any): void {
    this.setData(pin, place);
    this.save(pin);
  }

  approve(pin: any): void {
    pin.status = Status.APPROVED;
    pin.updatedAt = Date.now();

    const copy = Object.assign({}, pin);
    delete copy.$key;
    delete copy.$exists;
    this.approvedPins.push(copy);

    this.submittedPins.remove(pin.$key);
  };

  unapprove(pin: any): void {
    pin.status = Status.SUBMITTED;
    pin.updatedAt = Date.now();

    const copy = Object.assign({}, pin);
    delete copy.$key;
    delete copy.$exists;
    this.submittedPins.push(copy);

    this.approvedPins.remove(pin.$key);
  }

  isApproved(pin: any): boolean {
    return pin.status === Status.APPROVED;
  }

  // TODO: notify admin of flags through notifications
  flag(pin: any): void {
    pin.flagged = true;
    this.save(pin);
  }

  unflag(pin: any): void {
    pin.flagged = false;
    this.save(pin);
  }

  // Used to display approved pins on the map
  find(key: string, isApproved: boolean): FirebaseObjectObservable<any> {
    if (isApproved) {
      // console.log('approved');
      return this.af.database.object('/pins/approved/' + key, {preserveSnapshot: true});
    } else {
      // console.log('submitted');
      return this.af.database.object('/pins/submitted/' + key, {preserveSnapshot: true});
    }
  }

  private setData(pin: any, place: any): void {
    // console.log('SET DATA', pin, place);
    pin.placeId = place.place_id;
    pin.lat = place.geometry.location.lat();
    pin.lng = place.geometry.location.lng();
    pin.address = place.formatted_address;
    pin.short_address = place.formatted_address.substring(0, place.formatted_address.indexOf(','));
    pin.adr_address = place.adr_address;
    pin.vicinity = place.vicinity; // local area, like Brooklyn
    if (place.name) {
      pin.name = place.name;
    }

    if (place.phone) {
      pin.phone = place.formatted_phone_number;
    }

    if (place.opening_hours) {
      pin.opening_hours = place.opening_hours;
    }

    if (place.url) {
      pin.url = place.url;
    }

    if (place.icon) {
      pin.icon = place.icon;
    }

    pin.favorites = [];
    pin.status = Status.SUBMITTED;
    pin.createdAt = Date.now();
    pin.updatedAt = Date.now();
  }

  private save(pin: any): void {
    pin.updatedAt = Date.now();
    const key = pin.$key;
    delete pin.$key;
    delete pin.$exists;
    if (pin.status === Status.APPROVED) {
      this.approvedPins.update(key, pin);
    } else if (pin.status === Status.SUBMITTED) {
      this.submittedPins.update(key, pin);
    }
  }

  addToFavorites(pin: any, user: any, userManager: any): void {
    if (!pin.favorites) {
      pin.favorites = [];
    }
    const idx = pin.favorites.indexOf(user.id);
    if (idx === -1) {
      pin.favorites.push(user.id);
      // console.log('PUSHING KEY', pin.favorites);
      this.save(pin);
      userManager.addFavorite(pin);
    }
  }

  removeFromFavorites(pin: any, user: any, userManager: any): void {
    if (!pin || !pin.favorites) {
      return;
    }

    const idx = pin.favorites.indexOf(user.id);
    if (idx !== -1) {
      userManager.removeFavorite(pin);
      pin.favorites.splice(idx, 1);
      this.save(pin);
    }
  }

  isFavorite(pin: any, user: any): boolean {
    if (!pin || !pin.favorites) {
      return false;
    }

    return pin.favorites.indexOf(user.id) !== -1;
  }

  getFavorites() {

  }
}
