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
      // this.af.database.object('/userRoles/' +
      //     this.sanitizeUsername(userDetails.email), {preserveSnapshot: true})
      //     .subscribe((snapshots) => {
      //       this.currentUser = {};
      //       snapshots.forEach((snapshot) => {
      //         this.currentUser[snapshot.key] = snapshot.val();
      //       });
      //       onComplete({
      //         error: false,
      //         user: this.currentUser
      //       });
      //     });
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
        return this.login(userDetails);

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
}
