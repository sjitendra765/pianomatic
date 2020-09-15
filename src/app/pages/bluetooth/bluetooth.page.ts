
import {BluetoothService} from '../../providers/bluetooth.service'
import {TunerControllerService} from '../../providers/tuner-controller.service'

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    private bluetooth: BluetoothService, private Tuner:TunerControllerService,  private route: Router
  ) {
  }
  ngOnInit() {
    this.showSpinner = true;
      this.bluetooth.search().then((devices: Array<Object>) => {
        this.listToggle = true
        this.devices = devices;
        this.showSpinner = false;
      }, (error) => {
        this.showSpinner = false;
      });
  }
  selectDevice(device){
    this.address = device.address
    console.log(device)
    this.bluetooth.connect(this.address).then((status: String) =>{
      console.log("status", status)
      this.route.navigate(['/keyboard']);
    },(error)=>{
      console.log("error on connection",error)
    })
  }
  sendData(){
    var message = "h"
    this.bluetooth.dataInOut(message).subscribe(data => {
      console.log(data)
    }),(error)=>{
      console.log("error sending data",error)
    }
  }
  refreshBluetooth(refresher) {
    if (refresher) {
      this.bluetooth.search().then((successMessage: Array<Object>) => {
        this.devices = [];
        this.devices = successMessage;
        console.log("done" ,this.devices)
        refresher.target.complete();
      }, fail => {
        refresher.target.complete();
      });
    }
  }

 async isbusy(){
    var subscription = this.Tuner.isBusy().subscribe(r=>{
      if(r ==1){
        console.log("busy check",r)
        subscription.unsubscribe();
      }      
    })
  }
  
}