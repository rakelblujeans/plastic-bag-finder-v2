import { Injectable } from '@angular/core';
import { Geolocation } from 'ionic-native';

// import { googleMapsKey as apiKey } from '../google-api-key';
import { GoogleMapsLoader } from './google-maps-loader.service';

declare let google;

@Injectable()
export class PinMap {
  private map: any = null;
  private markers: Array<any> = [];
  private infoWindow: any = null;

  constructor(private googleMapsLoader: GoogleMapsLoader) {
    this.googleMapsLoader = googleMapsLoader;
  }

  public loadMap(mapElement: any): void {
    console.log('PinMap.loadMap', mapElement);
    this.mapElement = mapElement;
    this.googleMapsLoader.init(this.initMap.bind(this));
  }

  private setMapWithLocation(latLng: any): void {
    console.log('PinMap.setMapWithLocation', latLng, this.mapElement);
    const mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement, mapOptions);
    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // Wait until the map is loaded
    // google.maps.event.addListenerOnce(this.map, 'idle', () => {
    //   this.loadMarkers();
    //   // this.connectivityMonitor.enableInteraction();
    // });

    // google.maps.event.addListener(this.map, 'click', () => {
    //   this.closeInfoWindow();
    // });
  }

  public initMap(): void {
    console.log("***** PinMap.initMap cb");
    const options = {
      timeout: 10000,
      enableHighAccuracy: true
    };

    Geolocation.getCurrentPosition().then((position) => {
      const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.setMapWithLocation(latLng);
    }, (err) => {
      console.log(err);
      const latLng = new google.maps.LatLng(40.768037, -73.975705);
      this.setMapWithLocation(latLng);
    });
  }

  // private loadMarkers(): void {}

  // private closeInfoWindow(): void {
  //   if (this.infoWindow) {
  //     this.infoWindow.close();
  //   }
  // }

  // private clearMarkers(): void {
  //   if (!this.markers.length) {
  //     return;
  //   }

  //   for (let i = 0; i < this.markers.length; i++) {
  //     google.maps.event.clearInstanceListeners(this.markers[i]);
  //     this.markers[i].setMap(null);
  //   }

  //   this.markers.length = 0;
  // }

  // private loadMarkers(): void {
  //   // PinService.approvedPins.$loaded().then(function(pins) {
  //   //   // console.log("Pins: ", pins);
  //   //   for (var i = 0; i < pins.length; i++) {
  //   //     var pin = pins[i];
  //   //     var pinPos = new google.maps.LatLng(pin.lat, pin.lng);

  //   //     var marker = new google.maps.Marker({
  //   //       map: map,
  //   //       animation: google.maps.Animation.DROP,
  //   //       position: pinPos
  //   //     });
  //   //     markers.push(marker);

  //   //     addInfoWindow(marker, buildContentString(pin), pin);
  //   //   }
  //   // });
  // }

  //  // todo: define html in code
  // private buildContentString(pin: any): string {
  //   let output = '';
  //   // if ($scope.user && $scope.PinService.isFavorite(pin, $scope.user.uid)) {
  //   //   output += '<i class="icon ion-ios-star energized"></i>';
  //   // }
  //   if (pin.flagged) {
  //     output += '<i class="icon ion-ios-flag assertive pb-overlay-icon"></i>';
  //   }

  //   output += "<a class='map-info-titleLink' href='#/tab/mapPins/" + pin.$id + "'>" +
  //       (pin.name ? pin.name : pin.short_address) + "</a>";

  //   // todo: show icon if currently open
  //   // if (pin.opening_hours && pin.opening_hours.open_now) { }
  //   output += "<div><a class='map-info-DirectionsLink' href='https://www.google.com/maps/place/"
  //       + pin.address + "'>Directions</a></div>";

  //   return "<div class='map-infoContent'>" + output + "</div>";
  // }

  // private addInfoWindow(marker, message, record): void {
  //   this.infoWindow = new google.maps.InfoWindow({
  //     content: message
  //   });

  //   google.maps.event.addListener(marker, 'click', function() {
  //     this.closeInfoWindow();
  //     this.infoWindow.open(this.map, marker);
  //   });
  // }

  // private reloadMarkers(): void {
  //   this.clearMarkers();
  //   this.loadMarkers();
  // }
}
