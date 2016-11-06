import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

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

    if (this.isSignup) {
      this.userManager.signup(userDetails, this.ourOnSubmit.bind(this));
    } else {
     this.userManager.login(userDetails, this.ourOnSubmit.bind(this));
    }
  }

  ourOnSubmit(result) {
    if (!result.error) {
      this.viewCtrl.dismiss();
      this.onSubmit(result.user);
    } else {
      this.errorMsg = result.message.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  }
}
