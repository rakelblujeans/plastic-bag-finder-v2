import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Network } from "ionic-native";

declare var window;

@Injectable()
export class ConnectivityMonitor {
  disconnectSubscription: any;
  connectSubscription: any;
  onDevice: boolean;

  constructor(public platform: Platform) {
    this.platform = platform;
    this.onDevice = this.platform.is('cordova');
  }

  private onlineBrowserListener(e: any): void {
    // this.enableInteraction();
    console.log("went online");
  }

  private offlineBrowserListener(e: any): void {
    // this.disableInteraction();
    console.log("went offline");
  }

  startWatching(): void {
    console.log('start watching');
    if (this.onDevice) {
      // watch network for a disconnect
      this.disconnectSubscription = Network.onDisconnect().subscribe(() => {
        console.log('network was disconnected :-(');
      });

      // watch network for a connection
      this.connectSubscription = Network.onConnect().subscribe(() => {
        console.log('network connected!'); 
        // We just got a connection but we need to wait briefly
        // before we determine the connection type.  Might need to wait 
        // prior to doing any api requests as well.
        setTimeout(() => {
          if (Network.connection === 'wifi') {
            console.log('we got a wifi connection, woohoo!');
          }
        }, 3000);
      });
    } else {
      window.addEventListener("online", this.onlineBrowserListener, false);
      window.addEventListener("offline", this.offlineBrowserListener, false);
    }
  }

  stopWatching(): void {
    if (this.onDevice) {
      // stop disconnect watch
      this.disconnectSubscription.unsubscribe();
      // stop connect watch
      this.connectSubscription.unsubscribe();
    } else {
      window.removeEventListener("online", this.onlineBrowserListener, false);
      window.removeEventListener("offline", this.offlineBrowserListener, false);
    }
  }

  isOnline(): boolean {
    if (this.onDevice && Network.connection) {
      return Network.connection === Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }

  // enableInteraction() {}
  // disableInteraction(): any {}
}
