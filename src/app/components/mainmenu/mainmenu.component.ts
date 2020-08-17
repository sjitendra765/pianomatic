import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TemperamentComponent } from '../temperament/temperament.component';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.scss'],
})
export class MainmenuComponent implements OnInit {

  constructor( private popoverController: PopoverController) { }

  ngOnInit() {}
  async openTemperament(ev){
    const popover = await this.popoverController.create({
      component: TemperamentComponent,
      event: ev,
      cssClass: 'popover_class',
    });
    return await popover.present();
  }

}
