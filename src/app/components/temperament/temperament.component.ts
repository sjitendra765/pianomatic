import { Component, OnInit,NgZone   } from '@angular/core';
import { Storage } from '@ionic/storage';

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
  constructor(private storage: Storage,private zone: NgZone) {
    this.store = storage
   }
   ngOnInit(){
    this.store.forEach((v,k) => {
      if(k!="default" && k!= "name"){
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

  openInput(){
    this.show = true;
  }
  save(){
    this.show  = false;
    this.store.get('default').then(val=>{
      this.store.set(this.name,val)
      this.store.remove('default')
    })
    
    window.location.reload()
  }
  selectSetting(k){
    this.store.set('name',k)
    window.location.reload()
  }
  newSetting(){
    this.store.set('name','')
    window.location.reload()
  }

}
