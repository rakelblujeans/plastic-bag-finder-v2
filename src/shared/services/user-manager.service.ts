import { Injectable } from '@angular/core';
import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';
import { AngularFire } from 'angularfire2';

/* Google authentication is poorly documented (as of the time of this writing) so we've opted
 * to instead implement Email auth.
 * Documentation: https://docs.ionic.io/services/auth/
 */

@Injectable()
export class UserManager {
  currentUser: any;

  constructor(private auth: Auth, private user: User, private af: AngularFire) {
    if (this.auth.isAuthenticated()) {
      this.getUserRole(this.user.details.email);
    }
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  getUserRole(email, onComplete?) {
    const userId = this.sanitizeUsername(email);
    this.af.database.object('/userRoles/' + userId, {preserveSnapshot: true})
        .subscribe((snapshots) => {
          this.currentUser = {};
          snapshots.forEach((snapshot) => {
            this.currentUser[snapshot.key] = snapshot.val();
          });

          this.currentUser.id = userId;

          if (typeof onComplete === 'function') {
            onComplete({
              error: false,
              user: this.currentUser
            });
          }
        });
  }

  login(userDetails: UserDetails, onComplete?: any): any {
    this.auth.login('basic', userDetails).then(() => {
      this.getUserRole(userDetails.email, onComplete);
    }, (err: IDetailedError<string>) => {
      if (err.message.toLowerCase().startsWith('email and password are required')) {
        onComplete({error: true, message: 'Email and password are required'});
      } else {
        onComplete({error: true, message: 'Sorry, try again'});
      }
    });
  }

  private sanitizeUsername(str: string): string {
    // TODO: introduces a vulnerability where we may have multiple accounts that map to the same
    // username
    return str.replace(/@/gi, '_')
        .replace(/\./gi, '_')
        .replace(/#/gi, '_')
        .replace(/\$/gi, '_')
        .replace(/\+/gi, '_')
        .replace(/\[/gi, '_')
        .replace(/\]/gi, '_');
  }

  signup(userDetails: UserDetails, onComplete: any): any {
    return this.auth.signup(userDetails).then(() => {
        this.af.database.object('/userRoles/' + this.sanitizeUsername(userDetails.email)).set({
          email: userDetails.email,
          role: 'customer'
        });
        this.login(userDetails, onComplete);

    }, (err: IDetailedError<string[]>) => {
      for (let e of err.details) {
        onComplete({error: true, message: e});
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.currentUser = null;
  }

  isAdmin(): boolean {
    return this.currentUser && this.currentUser.role === 'admin';
  }

  addFavorite(pin: any) {
    console.log('got pin id', pin);
    let favoritesArr = this.currentUser.favorites ? this.currentUser.favorites.slice() : [];
    // const isAlreadyAdded = favoritesArr.some((p) => p.placeId === pin.placeId);
    // if (!isAlreadyAdded) {
      favoritesArr.push(pin);
      const user = this.af.database.object('/userRoles/' + this.sanitizeUsername(this.currentUser.email));
      user.update({favorites: favoritesArr});
    // }
  }

  removeFavorite(pin: any) {
    let favoritesArr = this.currentUser.favorites ? this.currentUser.favorites.slice() : [];
    favoritesArr = favoritesArr.filter((p) => pin.placeId != p.placeId);

    const user = this.af.database.object('/userRoles/' + this.sanitizeUsername(this.currentUser.email));
    user.update({favorites: favoritesArr});
  }
}
