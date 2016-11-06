import { Injectable } from '@angular/core';
import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

/* Google authentication is poorly documented (as of the time of this writing) so we've opted
 * to instead implement Email auth.
 * Documentation: https://docs.ionic.io/services/auth/
 */

@Injectable()
export class UserManager {
  currentUser: any;

  constructor(private auth: Auth, private user: User, private af: AngularFire) {}

  getCurrentUser(): any {
    return this.currentUser;
  }

  login(userDetails: UserDetails): any {
    return this.auth.login('basic', userDetails).then(() => {
      const userRole = this.af.database.object('/userRoles/' +
          this.sanitizeUsername(userDetails.email));
      this.currentUser = {
        email: userDetails.email,
        role: userRole.role
      };
      return {
        error: false,
        user: this.currentUser
      };
    }, (err: IDetailedError<string>) => {
      if (err.message.toLowerCase().startsWith('email and password are required')) {
        return {error: true, message: 'Email and password are required'};
      } else {
        return {error: true, message: 'Sorry, try again'};
      }
    });
  }

  private sanitizeUsername(str: string): string {
    // TODO: introduces a vulnerability where we may have multiple accounts that map to the same
    // username
    // console.log('we got', str);
    return str.replace(/@/gi, '_')
        .replace(/\./gi, '_')
        .replace(/#/gi, '_')
        .replace(/\$/gi, '_')
        .replace(/\+/gi, '_')
        .replace(/\[/gi, '_')
        .replace(/\]/gi, '_');
  }

  signup(userDetails: UserDetails): any {
    // console.log('addding', userDetails);
    return this.auth.signup(userDetails).then(() => {
        // console.log('sanitized', this.sanitizeUsername(userDetails.email));
        this.af.database.object('/userRoles/' + this.sanitizeUsername(userDetails.email)).set({
          email: userDetails.email,
          role: 'customer'
        });
        return this.login(userDetails);

    }, (err: IDetailedError<string[]>) => {
      for (let e of err.details) {
        return {error: true, message: e};
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.currentUser = null;
  }

  isAdmin(): boolean {
    console.log("HERE", this.currentUser);
    return this.currentUser && this.currentUser.role === 'admin';
  }
}
