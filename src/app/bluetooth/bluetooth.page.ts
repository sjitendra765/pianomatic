
import {BluetoothService} from '../bluetooth.service'
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bluetooth',
  templateUrl: 'bluetooth.page.html',
  styleUrls: ['bluetooth.page.scss']
})
export class BluetoothPage implements OnInit {

  devices: any[] = [];
  address = '';
  showSpinner = false;
  isConnected = false;
  message = 'demo';
  messages = [];
  listToggle = false;
  constructor(
    private bluetooth: BluetoothService
  ) {
  }
  ngOnInit() {
    this.showSpinner = true;
      this.bluetooth.searchBluetooth().then((devices: Array<Object>) => {
        this.listToggle = true
        this.devices = devices;
        this.showSpinner = false;
      }, (error) => {
        this.showSpinner = false;
      });
  }
  selectDevice(){
    this.address = "20:47:DA:DC:6E:FB"
    this.bluetooth.deviceConnection(this.address).then((status: String) =>{
      console.log("status", status)
    },(error)=>{
      console.log("error on connection",error)
    })
  }
  sendData(){
    this.bluetooth.dataInOut(`${this.message}\n`).subscribe(data => {
      console.log(data)
    })
  }
  refreshBluetooth(refresher) {
    if (refresher) {
      this.bluetooth.searchBluetooth().then((successMessage: Array<Object>) => {
        this.devices = [];
        this.devices = successMessage;
        console.log("done" ,this.devices)
        refresher.target.complete();
      }, fail => {
        refresher.target.complete();
      });
    }
  }
  
}