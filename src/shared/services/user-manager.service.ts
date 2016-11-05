import { Injectable } from '@angular/core';
import { Auth, User, IDetailedError } from '@ionic/cloud-angular';

/* Google authentication is poorly documented (as of the time of this writing) so we've opted
 * to instead implement Email auth.
 * Documentation: https://docs.ionic.io/services/auth/
 */

@Injectable()
export class UserManager {
  constructor(public auth: Auth, public user: User) {
    // this.approvedPins = this.af.database.list('/pins/approved');
  }

  login(userDetails) {
    return this.auth.login('basic', userDetails).then(() => {
      return {error: false, user: this.user};
    }, (err: IDetailedError<string>) => {
      if (err.message.toLowerCase().startsWith('email and password are required')) {
        return {error: true, message: 'Email and password are required'};
      } else {
        return {error: true, message: 'Sorry, try again'};
      }
    });
  }

  signup(userDetails) {
    return this.auth.signup(userDetails).then(() => {
      return {error: false, user: this.user};
    }, (err: IDetailedError<string[]>) => {
      for (let e of err.details) {
        return {error: true, message: e};
      }
    });
  }

  logout(): void {
    return this.auth.logout();
  }

  isAdmin(): boolean {
    console.log("HERE");
    // const userId = this.af.auth().currentUser.uid;
    // console.log('isAdmin', userId);
    // return firebase.database().ref('/userRoles/' + userId).once('value').then(function(snapshot) {
    //   var role = snapshot.val().role;
    //   return role === 'admin';
    // });
    return false;
  }
}
