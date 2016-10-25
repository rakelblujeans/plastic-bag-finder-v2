import { Injectable } from '@angular/core';

import { googleMapsKey as apiKey } from '../google-api-key';
import { ConnectivityMonitor } from '../../shared/services/connectivity-monitor.service';

declare let window;
declare let google;

@Injectable()
export class GoogleMapsLoader {
  private postLoadCallback: any = null;

  constructor(public connectivityMonitor: ConnectivityMonitor) {
    this.connectivityMonitor = connectivityMonitor;
  }

  init(postLoadCb): void {
    this.postLoadCallback = postLoadCb;
    // this.connectivityMonitor.disableInteraction();

    if (typeof window.google == "undefined" ||
        typeof google == "undefined" ||
        typeof google.maps == "undefined") {
      // console.warn("Google Maps SDK needs to be loaded", window.google);
      if (this.connectivityMonitor.isOnline()) {
        this.loadGoogleMaps();
      }
    }
    else {
      if (this.connectivityMonitor.isOnline()) {
        if (this.postLoadCallback) {
          this.postLoadCallback();
        }
        // this.connectivityMonitor.enableInteraction();
      } else {
        // this.connectivityMonitor.disableInteraction();
      }
    }
  }

  private loadGoogleMaps(): void {
    // this.connectivityMonitor.disableInteraction('Loading google maps');
    // This function will be called once the SDK has been loaded
    window.googleMapsCb = () => {
      window.google = google;
      if (this.postLoadCallback) {
        this.postLoadCallback();
        // this.connectivityMonitor.enableInteraction();
      } else {
        // this.connectivityMonitor.enableInteraction();
      }
    };

    // Create a script element to insert into the page
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "googleMaps";

    // Note the callback function in the URL is the one we created above
    if(apiKey) {
      script.src = 'https://maps.googleapis.com/maps/api/js?v=3&key=' +
          apiKey + '&libraries=geometry,places&callback=googleMapsCb';
    }
    else {
      script.src = 'https://maps.googleapis.com/maps/api/js?v=3&libraries=geometry,places' +
        '&callback=googleMapsCb';
    }

    document.body.appendChild(script);
  }

  // private checkLoaded(): void {
  //   if (typeof google == "undefined" || typeof google.maps == "undefined") {
  //     this.loadGoogleMaps();
  //   } else {
  //     // connectivityMonitor.enableInteraction();
  //   }
  // }
}
