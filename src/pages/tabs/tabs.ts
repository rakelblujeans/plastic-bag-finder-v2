import { Component } from '@angular/core';

import { AccountPage } from '../account/account';
import { MapPage } from '../map/map';
import { PinListPage } from '../pin-list/pin-list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = MapPage;
  tab2Root: any = PinListPage;
  tab3Root: any = AccountPage;

  constructor() {

  }
}
