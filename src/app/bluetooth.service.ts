import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  constructor() { }
  getStatus():any{
    //connect to bluetooth and get battery status
    //return battery status
  }
  sendKeyPress(data:any):void{
    //connect to bluetooth and sends the data of keyboard
  }
}
