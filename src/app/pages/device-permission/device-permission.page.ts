import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx'
import { TranslateService } from '@ngx-translate/core';
import {BluetoothService} from '../../providers/bluetooth.service';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-device-permission',
  templateUrl: './device-permission.page.html',
  styleUrls: ['./device-permission.page.scss'],
})
export class DevicePermissionPage implements OnInit {

  constructor(private openNativeSettings: OpenNativeSettings,public toastController: ToastController,private storage: Storage,private diagnostic: Diagnostic, private route: Router,private translate: TranslateService, private Bluetooth: BluetoothService) { 
    //translate.setDefaultLang('en');
  }
  
  async ngOnInit(){
    try{
      let getBluetoothAuth = await this.diagnostic.isBluetoothAvailable()
      if(getBluetoothAuth){
        if(!environment.production)
          this.connectPairedDevice()
        else
          this.route.navigate(['/keyboard'])    
      }
    }
    catch(err){
      console.log(err)
    }
  }
  async askForPermission(){
    try{
      let getBluetoothAuth = await this.diagnostic.isBluetoothAvailable();
      if(getBluetoothAuth){
        if(!environment.production)
          this.connectPairedDevice()
        else
          this.route.navigate(['/keyboard'])  
      }
        
    }
    catch(err){
      console.log(err)
    }

  }
  async openBluetoothSetting(){
    try{
      await this.openNativeSettings.open("bluetooth")
    }
    catch(err){
      console.log(err)
    }
  }
  async connectPairedDevice(){
    let deviceList = null
      try{
        const bluetoothId = await this.storage.get('bluetoothId');
        if(bluetoothId){
          await this.Bluetooth.connect(bluetoothId)
          this.route.navigate(['/keyboard']) 
          return
        }
        deviceList  = await this.Bluetooth.search()
        for(let i =0; i< deviceList.length;i++){
          const selectDevice = await this.Bluetooth.connect(deviceList[i].address)
          let subscription = this.Bluetooth.dataInOut('h').subscribe(async r=>{
            console.log("t",r,"t")
            if(r == "namaste\n" || r == "namaste"){
              console.log("correct device connected")
              this.storage.set('bluetoothId',deviceList[i].address)
              this.presentToast(this.translate.instant('BLUETOOTH.CONNECTED'), 'primary')
              this.route.navigate(['/keyboard'])    
              subscription.unsubscribe()
              return
            }
            else{
              console.log("Incorrect device connected. Now disconnecting...")
              await this.Bluetooth.stop()
            }
          })
        }
        //this.presentToast("Please pair correct device",'danger')
      }
      catch(err){
        console.log("try again",err)
        this.presentToast(this.translate.instant(err),'danger')
        this.route.navigate(['/keyboard'])
      }
            
  }
  async presentToast(message,color) {
    let toast =await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: color
    });
  
    toast.onDidDismiss();
  
    toast.present();
  }
}
