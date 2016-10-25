import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PinMap } from '../../shared/services/pin-map.service';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  providers: [PinMap]
})

export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, public pinMap: PinMap) {
    this.pinMap = pinMap;
  }

  ionViewDidLoad() {
    this.pinMap.loadMap(this.mapElement.nativeElement);
  }
}
