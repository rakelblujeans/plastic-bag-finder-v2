import { Component } from '@angular/core';
import { Auth } from '@ionic/cloud-angular';
import { ModalController, NavController, Platform } from 'ionic-angular';

import { UserManager } from '../../shared/services/user-manager.service';
import { PinDetailPage } from '../pin-detail/pin-detail';
import { AuthModalPage } from './auth-modal';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  user: any;
  passwordResetUrl: any;

  constructor(private auth: Auth, private modalCtrl: ModalController,
      private navController: NavController, private platform: Platform,
      private userManager: UserManager) {
    this.passwordResetUrl = auth.passwordResetUrl;
    platform.ready().then(() => {
      this.setup();
    });
  }

  ionViewWillEnter() {
    this.setup();
  }

  setup() {
    this.user = this.userManager.getCurrentUser();
  }

  openSignupModal(): void {
    const modal = this.modalCtrl.create(AuthModalPage, {
      onSubmit: this.onSubmit.bind(this),
      isSignup: true
    });
    modal.present();
  }

  openLoginModal(): void {
    const modal = this.modalCtrl.create(AuthModalPage, {
      onSubmit: this.onSubmit.bind(this),
      isSignup: false
    });
    modal.present();
  }

  onSubmit(user): void {
    this.user = user;
  }

  logout(): void {
    this.userManager.logout();
    this.user = null;
  }

  visitPin(pin: any): void {
    this.navController.push(PinDetailPage, {pin});
  }
}
