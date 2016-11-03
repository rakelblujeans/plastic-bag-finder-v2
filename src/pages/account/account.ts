import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { UserManager } from '../../shared/services/user-manager.service';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  user: any;


  constructor(public navCtrl: NavController, private userManager: UserManager) {
    this.userManager = userManager;
    //  $scope.offAuthListener = $scope.Auth.$onAuthStateChanged(function(firebaseUser) {
    //   $scope.user = firebaseUser;
    // });
  }

  login(): void {
    this.userManager.login();
  }

  logout(): void {
    this.userManager.logout();
  }

  closeAccount(): void {
    this.userManager.closeAccount();
  }
}
