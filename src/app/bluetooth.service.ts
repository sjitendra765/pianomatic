import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  constructor() { }
  getBatteryStatus():any{
    //connect to bluetooth and get battery status
    //return battery status
  }
  sendDataToDevice(data:any):void{
    //connect to bluetooth and sends the data of keyboard
  }
}
