import { Injectable } from '@angular/core';
import { Geolocation } from 'ionic-native';

import { GoogleMapsLoader } from './google-maps-loader.service';
import { PinManager } from './pin-manager.service';

declare let google;

@Injectable()
export class PinMap {
  private map: any = null;
  private markers: Array<any> = [];
  private infoWindow: any = null;

  constructor(public googleMapsLoader: GoogleMapsLoader, public pinManager: PinManager) {
    this.googleMapsLoader = googleMapsLoader;
  }

  loadMap(mapElement: any): void {
    this.mapElement = mapElement;
    this.googleMapsLoader.init(this.initMap.bind(this));
  }

  initMap(): void {
    // const options = {
    //   timeout: 10000,
    //   enableHighAccuracy: true
    // };

    Geolocation.getCurrentPosition().then((position) => {
      const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.setMapWithLocation(latLng);
    }, (err) => {
      console.log(err);
      const latLng = new google.maps.LatLng(40.768037, -73.975705);
      this.setMapWithLocation(latLng);
    });
  }

  private setMapWithLocation(latLng: any): void {
    const mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement, mapOptions);
    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // Wait until the map is loaded
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.loadMarkers();
      // this.connectivityMonitor.enableInteraction();
    });

    google.maps.event.addListener(this.map, 'click', () => {
      this.closeInfoWindow();
    });
  }

  private closeInfoWindow(): void {
    if (this.infoWindow) {
      this.infoWindow.close();
    }
  }

  // private clearMarkers(): void {
  //   if (!this.markers.length) {
  //     return;
  //   }

  //   for(const marker of this.markers) {
  //     google.maps.event.clearInstanceListeners(marker);
  //     marker.setMap(null);
  //   }

  //   this.markers.length = 0;
  // }

  private loadMarkers(): void {
    this.pinManager.approvedPins.subscribe(pins => {
      // console.log("Pins: ", pins);
      for (const pin of pins) {
        const pinPos = new google.maps.LatLng(pin.lat, pin.lng);

        const marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: pinPos
        });
        this.markers.push(marker);

        this.addInfoWindow(marker, this.buildContentString(pin), pin);
      }
    });
  }

  // Todo: define html in code
  private buildContentString(pin: any): string {
    let output = '';
    // Todo: highlight if favorite
    // if ($scope.user && $scope.PinService.isFavorite(pin, $scope.user.uid)) {
    //   output += '<i class="icon ion-ios-star energized"></i>';
    // }
    if (pin.flagged) {
      output += '<ion-icon name="flag" color="danger"></ion-icon>';
    }

    output += "<a class='map-infoWindowTitle' href='#/tab/mapPins/" + pin.$key + "'>" +
        (pin.name ? pin.name : pin.short_address) + "</a>";

    // Todo: show icon if currently open
    // if (pin.opening_hours && pin.opening_hours.open_now) { }
    output += "<div><a class='map-infoWindowDirections' href='https://www.google.com/maps/place/"
        + pin.address + "'>Directions</a></div>";

    return "<div class='map-infoWindowContent'>" + output + "</div>";
  }

  private addInfoWindow(marker, message, record): void {
    this.infoWindow = new google.maps.InfoWindow({
      content: message
    });

    google.maps.event.addListener(marker, 'click', () => {
      this.closeInfoWindow();
      this.infoWindow.open(this.map, marker);
    });
  }

  // private reloadMarkers(): void {
  //   this.clearMarkers();
  //   this.loadMarkers();
  // }
}