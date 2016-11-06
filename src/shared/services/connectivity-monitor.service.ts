import { Injectable } from '@angular/core';
import { LoadingController, Platform } from 'ionic-angular';
import { Network } from "ionic-native";

declare var window;
declare var Connection;

@Injectable()
export class ConnectivityMonitor {
  disconnectSubscription: any;
  connectSubscription: any;
  onDevice: boolean;
  loader: any;

  constructor(private platform: Platform, private loadingCtrl: LoadingController) {
    this.onDevice = this.platform.is('cordova');
  }

  startWatching(): void {
    // console.log('start watching');
    if (this.onDevice) {
      // watch network for a disconnect
      this.disconnectSubscription = Network.onDisconnect().subscribe(() => {
        // console.log('network was disconnected :-(');
        this.openLoadingModal();
      });

      // watch network for a connection
      this.connectSubscription = Network.onConnect().subscribe(() => {
        // console.log('network connected!'); 
         this.closeLoadingModal();

        // We just got a connection but we need to wait briefly
        // before we determine the connection type.  Might need to wait 
        // prior to doing any api requests as well.
        setTimeout(() => {
          if (Network.connection === 'wifi') {
            // console.log('we got a wifi connection, woohoo!');
          }
        }, 3000);
      });
    } else {
      window.addEventListener("online", this.onlineBrowserListener.bind(this), false);
      window.addEventListener("offline", this.offlineBrowserListener.bind(this), false);
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
      // console.log('--ONLINE?', Network.connection !== Connection.NONE);
      return Network.connection !== Connection.NONE;
    } else {
      return navigator.onLine;
    }
  }

  disableInteractivity(message?: string) {
    this.openLoadingModal(message);
  }

  enableInteractivity() {
    this.closeLoadingModal();
  }

  private openLoadingModal(message?: string) {
    this.loader = this.loadingCtrl.create({
      content: message || "Network connection lost"
    });
    this.loader.present();
  }

  private closeLoadingModal() {
    if (this.loader) {
      this.loader.dismissAll();
    }
  }

  private onlineBrowserListener(e: any): void {
    // this.enableInteraction();
    // console.log("went online");
    this.closeLoadingModal();
  }

  private offlineBrowserListener(e: any): void {
    // this.disableInteraction();
    // console.log("went offline");
    this.openLoadingModal();
  }
}
