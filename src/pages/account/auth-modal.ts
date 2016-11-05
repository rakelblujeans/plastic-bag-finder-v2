import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

import { AccountPage } from './account';
import { UserManager } from '../../shared/services/user-manager.service';

@Component({
  templateUrl: 'auth-modal.html'
})
export class AuthModalPage {
  email: string;
  password: string;
  errorMsg: string = null;
  onSubmit: any;
  isSignup: boolean;

  constructor(private viewCtrl: ViewController, private userManager: UserManager,
      private navParams: NavParams) {
    this.onSubmit = this.navParams.get('onSubmit');
    this.isSignup = !!this.navParams.get('isSignup');
  }

  dismiss() {
    this.email = null;
    this.password = null;
    this.viewCtrl.dismiss();
  }

  submit($event) {
    $event.preventDefault();
    this.errorMsg = null;

    const userDetails = {
      email: this.email,
      password: this.password
    };

    let authMethod;
    if (this.isSignup) {
      console.log('signing', this.userManager);
      authMethod = this.userManager.signup(userDetails);
    } else {
      console.log('logging', this.userManager);
      authMethod = this.userManager.login(userDetails);
    }

    authMethod.then((result) => {
      if (!result.error) {
        this.viewCtrl.dismiss();
        console.log('user', result.user);

        // immediately sign in newly registered users
        if (this.isSignup) {
          this.userManager.login(userDetails);
        }
        this.onSubmit(result.user);

      } else {
        this.errorMsg = result.message.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    });
  }
}
