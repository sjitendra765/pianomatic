import { Component, OnInit,NgZone   } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-temperament',
  templateUrl: './temperament.component.html',
  styleUrls: ['./temperament.component.scss'],
})
export class TemperamentComponent implements OnInit {
  show:boolean= false;
  name:string;
  list:Array<any>= []
  store;
  constructor(private storage: Storage, private translate: TranslateService, public toastController: ToastController, private zone: NgZone) {
    this.store = storage
   }
   ngOnInit(){
    this.store.forEach((v,k) => {
      if(k!="default" && k!= "name" && k!= "bluetoothId"){
        this.list.push(k)
      }
    });
   }
   ionViewWillEnter() {
    this.store.forEach((v,k) => {
      if(k!="default" && k!= "name"){
       // this.list.push(k)
      }
    });
  }

  async selectSetting(k){
    await this.store.set('name',k)
    this.presentToast(k + ' '+this.translate.instant( 'TEMPERAMENT_LOADED'),'primary')
    window.location.reload()
  }
  async newSetting(){
    await this.store.set('name','')
    window.location.reload()
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
