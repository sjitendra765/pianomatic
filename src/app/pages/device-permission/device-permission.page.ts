import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-device-permission',
  templateUrl: './device-permission.page.html',
  styleUrls: ['./device-permission.page.scss'],
})
export class DevicePermissionPage implements OnInit {

  constructor(private diagnostic: Diagnostic, private route: Router,translate: TranslateService) { 
    //translate.setDefaultLang('en');
  }
  
  async ngOnInit(){
    try{
      var getBluetoothAuth = await this.diagnostic.isBluetoothAvailable()
      var getMicrophoneAuth = await this.diagnostic.isMicrophoneAuthorized()
      if(getBluetoothAuth && getMicrophoneAuth){
        this.route.navigate(['/keyboard']);
      }
    }
    catch(err){
      console.log(err)
    }
  }
  async askForPermission(){
    try{
      var getBluetoothAuth = await this.diagnostic.isBluetoothAvailable();
      var getMicrophoneAuth =await this.diagnostic.isMicrophoneAuthorized();
      if(!getBluetoothAuth){
        //await this.diagnostic.requestBluetoothAuthorization()
      }
      if(!getMicrophoneAuth){
        await this.diagnostic.requestMicrophoneAuthorization()
      }
      if(getBluetoothAuth && getMicrophoneAuth)
        this.route.navigate(['/keyboard'])
    }
    catch(err){
      console.log(err)
    }

  }
}
