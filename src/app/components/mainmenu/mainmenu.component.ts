import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TemperamentComponent } from '../temperament/temperament.component';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.scss'],
})
export class MainmenuComponent implements OnInit {
  show:boolean= false;
  store;
  name:string;
  constructor( private popoverController: PopoverController, private storage: Storage,) {
    this.store = storage
   }

  ngOnInit() {}
  async openTemperament(ev){
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
    this.store.get('default').then(val=>{
      this.store.set(this.name,val)
      this.store.remove('default')
    })
    
   // window.location.reload()
  }

}
