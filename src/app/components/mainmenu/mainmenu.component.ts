import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { TemperamentComponent } from '../temperament/temperament.component';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import {KeyboardService} from '../../providers/keyboard.service'
import { from } from 'rxjs';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.scss'],
})
export class MainmenuComponent implements OnInit {
  show:boolean= false;
  changed:boolean = false;
  showSave:boolean= false;
  store;
  name:string;
  currentTempo;
  constructor( private popoverController: PopoverController , private translate: TranslateService,private keyboard: KeyboardService, public toastController: ToastController, private storage: Storage,) {
    this.store = storage
   }

  async ngOnInit() {
    this.keyboard.getFrequencyEmitter().subscribe(r=>{
      this.changed = r;
    })
    this.currentTempo = await this.store.get('name')
  }
  
  async openTemperament(ev){
    this.showSave = false;
    if(this.changed){
      this.currentTempo = this.currentTempo+'*';
      this.showSave = true
      return    
    }
    this.show = false;
    this.changed = false;
    this.currentTempo = this.currentTempo.replace(/\*\s*$/, "");
    const popover = await this.popoverController.create({
      component: TemperamentComponent,
      event: ev,
      cssClass: 'popover_class',
    });
    return await popover.present();
  }
  openInput(){
    this.show = !this.show;
  }
  save(){
    this.show  = false;
    this.showSave = false;
    this.changed = false;
    this.currentTempo = this.currentTempo.replace(/\*\s*$/, "");
    this.store.get('default').then(val=>{
      this.store.set(this.name,val)
      this.store.remove('default')
    })
    this.presentToast(this.name +' '+this.translate.instant('TEMPERAMENT_SAVED'),'primary')
    
   // window.location.reload()
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
