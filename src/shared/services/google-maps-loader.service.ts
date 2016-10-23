import { Injectable } from '@angular/core';

import { GoogleMapsAPIKey } from '../google-api-key.ts';

@Injectable()
export class GoogleMapsLoader {
  loadGoogleMaps(): void {}
}

// angular.module('starter.services')
//   .factory('GoogleMapsLoader', ['$ionicLoading', 'ConnectivityMonitor', 'googleMapsKey',
//     function($ionicLoading, ConnectivityMonitor, googleMapsKey) {

//     var apiKey = false;
//     var postLoadCallback = null;

//     function loadGoogleMaps() {
//       ConnectivityMonitor.disableInteraction('Loading...');

//       // This function will be called once the SDK has been loaded
//       window.googleMapsCb = function() {
//         window.google = google;
//         if (postLoadCallback) {
//           postLoadCallback();
//           ConnectivityMonitor.enableInteraction();
//         } else {
//           ConnectivityMonitor.enableInteraction();
//         }
//       };

//       // Create a script element to insert into the page
//       var script = document.createElement("script");
//       script.type = "text/javascript";
//       script.id = "googleMaps";

//       // Note the callback function in the URL is the one we created above
//       if(apiKey) {
//         script.src = 'https://maps.googleapis.com/maps/api/js?v=3&key=' +
//             apiKey + '&libraries=geometry,places&callback=googleMapsCb';
//       }
//       else {
//         script.src = 'https://maps.googleapis.com/maps/api/js?v=3&libraries=geometry,places' +
//           '&callback=googleMapsCb';
//       }

//       document.body.appendChild(script);
//     }

//     function checkLoaded() {
//       if (typeof google == "undefined" || typeof google.maps == "undefined") {
//         loadGoogleMaps();
//       } else {
//         ConnectivityMonitor.enableInteraction();
//       }
//     }

//     return {
//       init: function(postLoadCb) {
//         apiKey = googleMapsKey;
//         postLoadCallback = postLoadCb;
//         ConnectivityMonitor.disableInteraction();

//         if (typeof window.google == "undefined" ||
//             typeof google == "undefined" ||
//             typeof google.maps == "undefined") {
//           // console.warn("Google Maps SDK needs to be loaded", window.google);
//           if (ConnectivityMonitor.isOnline()) {
//             loadGoogleMaps();
//           }
//         }
//         else {
//           if (ConnectivityMonitor.isOnline()) {
//             if (postLoadCallback) {
//               postLoadCallback();
//             }
//             ConnectivityMonitor.enableInteraction();
//           } else {
//             ConnectivityMonitor.disableInteraction();
//           }
//         }
//       }
//     };
//   }]);
