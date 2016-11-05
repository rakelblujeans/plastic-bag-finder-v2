import { Component } from '@angular/core';
import { Auth } from '@ionic/cloud-angular';
import { ModalController, NavController } from 'ionic-angular';

import { AuthModalPage } from './auth-modal';
import { UserManager } from '../../shared/services/user-manager.service';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  user: any;

  constructor(private auth: Auth, private modalCtrl: ModalController,
      private navCtrl: NavController, private userManager: UserManager) {
    if (!this.auth.isAuthenticated()) {
      this.user = null;
    }
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
}
