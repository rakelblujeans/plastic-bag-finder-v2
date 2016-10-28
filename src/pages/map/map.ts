import { Component, ViewChild, ElementRef } from '@angular/core';

import { PinMap } from '../../shared/services/pin-map.service';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  providers: [PinMap]
})

export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(private pinMap: PinMap) {
  }

  ionViewDidLoad() {
    this.pinMap.loadMap(this.mapElement.nativeElement);
  }
}
