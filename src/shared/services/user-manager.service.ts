import { Injectable } from '@angular/core';
import { GoogleAuth, User } from '@ionic/cloud-angular';

// TODO: See Xavier's app for a full Ionic Cloud Auth integration

@Injectable()
export class UserManager {
  constructor(private googleAuth: GoogleAuth, private user: User) {
    // this.af = af;
    // this.af.auth.subscribe(auth => console.log(auth));
    // this.approvedPins = this.af.database.list('/pins/approved');
  }

  login() {
    this.googleAuth.login().then((success) => {
      console.log('logged in', success);
    }, (error) => {
      console.log('ERROR logging in', error);
    });
  }

  logout(): void {
    console.log('logout');
    this.googleAuth.logout();
  }

  closeAccount(): void {
    // TODO
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
