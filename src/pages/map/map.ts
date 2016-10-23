import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PinMap } from '../../shared/services/pin-map.service';

// declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  providers: [PinMap]
})

export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, private pinMap: PinMap) {
    this.pinMap = pinMap;
  }

  ionViewDidLoad() {
    this.pinMap.loadMap(this.mapElement.nativeElement);
    // this.loadMap();
  }

  // loadMap() {
  //   let latLng = new google.maps.LatLng(-34.9290, 138.6010);

  //   let mapOptions = {
  //     center: latLng,
  //     zoom: 15,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP
  //   }

  //   this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  // }

}
