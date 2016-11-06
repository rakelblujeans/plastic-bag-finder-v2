import { Component, ViewChild, ElementRef } from '@angular/core';

import { PinMap } from '../../shared/services/pin-map.service';
import { UserManager } from '../../shared/services/user-manager.service';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  providers: [PinMap]
})

export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(private pinMap: PinMap, private userManager: UserManager) {
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.pinMap.loadMap(this.mapElement.nativeElement);
    }, 2000);
  }

  ionViewWillEnter() {
    // trigger a preload of user data
    this.userManager.getCurrentUser();
  }
}
