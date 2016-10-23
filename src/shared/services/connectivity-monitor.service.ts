import {Injectable} from '@angular/core';
import {Network} from "ionic-native";

@Injectable()
export class ConnectivityMonitor {
  disconnectSubscription: any;
  connectSubscription: any;
  isConnected: any;

  constructor() {}

  startWatching(): void {
    // watch network for a disconnect
    this.disconnectSubscription = Network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.isConnected = false;
    });

    // watch network for a connection
    this.connectSubscription = Network.onConnect().subscribe(() => {
      console.log('network connected!'); 
      this.isConnected = true;
      // We just got a connection but we need to wait briefly
      // before we determine the connection type.  Might need to wait 
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (Network.connection === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });
  }

  stopWatching(): void {
    // stop disconnect watch
    this.disconnectSubscription.unsubscribe();
    // stop connect watch
    this.connectSubscription.unsubscribe();
  }

  isOnline(): boolean {
    return this.isConnected;
  }

  isOffline(): boolean {
    return !this.isConnected;
  }
}
