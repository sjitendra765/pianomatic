import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Observable, Subscription, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { rejects } from 'assert';

@Injectable()
export class BluetoothService {

  private connection: Subscription;
  private connectionCommunication: Subscription;
  private reader: Observable<any>;

  constructor(
    private bluetoothSerial: BluetoothSerial
  ) {  }
  /**
   * Search for available bluetooth devices.
   * @return {Promise<Object>} Returns a list of the devices that were found
   */
  search(): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.bluetoothSerial.isEnabled().then(success => {
        this.bluetoothSerial.discoverUnpaired().then(response => {
          if (response.length > 0) {
            resolve(response);
          } else {
            reject('BLUETOOTH.NOT_DEVICES_FOUND');
          }
        }).catch((error) => {
          reject('BLUETOOTH.NOT_AVAILABLE_IN_THIS_DEVICE');
        });
      }, fail => {
        reject('BLUETOOTH.NOT_AVAILABLE');
      });
    });
  }
  getPermission(){
    return new Promise((resolve, reject)=>{
      this.bluetoothSerial.isEnabled().then(success =>{
        resolve("Bluetooth has permission")
      }).catch((error)=>{
        reject("BLUETOOTH NOT ENABLED")
      })
    })
  }
  /*
  * check if device is connected
  */
  getStatus() {
    return new Promise((resolve, reject) => {
      this.bluetoothSerial.isConnected().then(isConnected => {
        resolve('BLUETOOTH.CONNECTED');
      }, notConnected => {
        reject('BLUETOOTH.NOT_CONNECTED');
      });
    });
  }
  /**
   * Bluetooth devices have its mac adrress,
   * it takes address input as a string and promise to returns string for its sucessfull connection or failure
   */
  connect(address: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.connection = this.bluetoothSerial.connect(address).subscribe(() => {
        resolve('BLUETOOTH.CONNECTED');
      }, fail => {
        console.log("fali",fail)
        reject('BLUETOOTH.CANNOT_CONNECT');
      });
    });
  }

  dataInOut(message: string): Observable<any> {
    return Observable.create(observer => {
      this.bluetoothSerial.isConnected().then((isConnected) => {
        this.reader = from(this.bluetoothSerial.write(message)).pipe(mergeMap(() => {
            return this.bluetoothSerial.subscribeRawData();
          })).pipe(mergeMap(() => {
            return this.bluetoothSerial.readUntil('\n');   
          }));
        this.reader.subscribe(data => {
          observer.next(data);
        });
      }, notConected => {
        observer.next('BLUETOOTH.NOT_CONNECTED');
        observer.complete();
      });
    });
  }

  stop(): Promise<boolean> {
    return new Promise((result) => {
      if (this.bluetoothSerial.isConnected) {
        this.bluetoothSerial.disconnect();
      }
      result(true);
    });
  }

  
}