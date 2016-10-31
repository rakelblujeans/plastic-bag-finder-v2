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
    // this.connectivityMonitor.disableInteractivity();
    const googleMapsLoaded = typeof google !== "undefined"; // || typeof google.maps !== "undefined";
    const isOnline = this.connectivityMonitor.isOnline();
    if (isOnline && !googleMapsLoaded) {
      // console.warn("Google Maps SDK needs to be loaded", window.google);
      this.loadGoogleMaps();
    } else if (isOnline && googleMapsLoaded) {
        if (this.postLoadCallback) {
          this.postLoadCallback();
        }
        this.connectivityMonitor.enableInteractivity();
    } else if (!isOnline) {
        this.connectivityMonitor.disableInteractivity();
    }
  }

  private loadGoogleMaps(): void {
    this.connectivityMonitor.disableInteractivity('Loading google maps');
    // This function will be called once the SDK has been loaded
    window.googleMapsCb = () => {
      window.google = google;
      if (this.postLoadCallback) {
        this.postLoadCallback();

      }
      this.connectivityMonitor.enableInteractivity();
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
}
