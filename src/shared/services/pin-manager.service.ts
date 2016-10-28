import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

enum Status {
  SUBMITTED,
  APPROVED,
  FLAGGED
};

// todo: limit by proximity to me?
// todo: pagination?

@Injectable()
export class PinManager {
  private af: any;
  submittedPins: FirebaseListObservable<any>;
  approvedPins: FirebaseListObservable<any>;

  constructor(af: AngularFire) {
    this.af = af;
    this.approvedPins = this.af.database.list('/pins/approved');
    this.submittedPins = this.af.database.list('/pins/submitted');
    //   query: {
    //     orderByChild: 'timestamp'
    //   }
  }

  add(place: any): void {
    // console.log('inside adding', place);
    // console.log('submittedPins', submittedPins);
    const newPin = {};
    this.setData(newPin, place);
    if (newPin.address !== '' && newPin.address !== null) {
      this.submittedPins.push(newPin);
    }
  }

  remove(pin: any): void {
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
    // console.log(pin, pin.$key);
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

  isApproved(pin: any): void {
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
      return this.af.database.object('/pins/approved/' + key);
    } else {
      return this.af.database.object('/pins/submitted/' + key);
    }
  }

  private setData(pin: any, place: any): void {
    // console.log(pin, place);
    pin.placeId = place.place_id;
    pin.lat = place.geometry.location.lat();
    pin.lng = place.geometry.location.lng();
    pin.address = place.formatted_address;
    pin.short_address = place.formatted_address.substring(0, place.formatted_address.indexOf(','));
    pin.adr_address = place.adr_address;
    pin.vicinity = place.vicinity; // local area, like Brooklyn
    if (pin.name) {
      pin.name = place.name;
    }

    if (pin.phone) {
      pin.phone = place.formatted_phone_number;
    }

    if (place.opening_hours) {
      pin.opening_hours = place.opening_hours;
    }

    if (pin.url) {
      pin.url = place.url;
    }

    if (pin.icon) {
      pin.icon = place.icon;
    }

    pin.favorites = [];
    pin.status = 'submitted';
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

  private addToFavorites(pin: any, uid: any): void {
    if (!pin.favorites) {
      pin.favorites = [];
    }

    var idx = pin.favorites.indexOf(uid);
    if (idx == -1) {
      pin.favorites.push(uid);
      this.save(pin);
    }
  }

  private removeFromFavorites(pin: any, uid: any): void {
    if (!pin || !pin.favorites) {
      return;
    }

    var idx = pin.favorites.indexOf(uid);
    if (idx > -1) {
      pin.favorites.splice(idx, 1);
      this.save(pin);
    }
  }

  isFavorite(pin: any, uid: any): boolean {
    if (!pin || !pin.favorites) {
      return false;
    }

    return pin.favorites.indexOf(uid) > -1;
  }

}