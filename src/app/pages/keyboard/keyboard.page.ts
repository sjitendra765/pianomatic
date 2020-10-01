import { Component, OnInit, ElementRef, ViewChild,Inject,
  ViewContainerRef,  
  QueryList,
  ViewChildren, OnDestroy} from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import {KeyboardData} from '../../static/keyboard-dataset';
import {Keyboard} from '../../models/piano-keyboard';
import { Platform } from '@ionic/angular';
import {Service} from '../../providers/dialogueBox.service'
import { createAnimation } from "@ionic/core";
import { Storage } from '@ionic/storage';
import {BluetoothService} from '../../providers/bluetooth.service'

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.page.html',
  styleUrls: ['./keyboard.page.scss'],
})
export class KeyboardPage implements OnInit , OnDestroy {
  keyboardData:any = KeyboardData;
  key:any;
  public WIDTH: number
  public HEIGHT: number

  @ViewChildren('dialogue', {read: ViewContainerRef}) public widgetTargets: QueryList<ViewContainerRef>;

  viewContainerRef: any
  service: any;
  prevIdx: number;
  prevKey: any;
  progressInterval;
  width = 3330
  dialogueWidth: number;
  store: any;
  constructor(
     private screenOrientation: ScreenOrientation,private bluetoothModule: BluetoothService, platform:Platform,private storage: Storage, private el: ElementRef, @Inject(Service) service, 
    @Inject(ViewContainerRef) viewContainerRef)
     { 
      platform.ready().then(() => {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
        console.log('Width: ' + platform.width());
        console.log('Height: ' + platform.height());
        if(platform.isLandscape()){
          this.HEIGHT = platform.height()-1;
          this.WIDTH = platform.width()
        }else{
          this.HEIGHT = platform.width();
          this.WIDTH = platform.height() -1;
        }
      });
      this.service = service
      this.store = storage
     }
  ngOnInit() {
   // console.log(this.keyboardData[0].color)
   //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    
  }
  ngOnDestroy(){
    console.log("on destroy called");
  }
  async ionViewWillEnter(){

    await this.store.set("default", this.keyboardData)
    let name = await this.store.get('name')
    if(name == '' || name == null){
      this.key = await this.store.get('default')
    }else{
      this.key = await this.store.get(name)
      if(this.key == null){
        this.key = await this.store.get('default')
        await this.store.remove('name')
      }
    }
    for(let i=0; i< this.key.length; i++){
      this.service.setRootViewContainerRef(this.widgetTargets.toArray()[i])
      this.service.addDynamicComponent(this.key[i]).subscribe(k=>{
        this.key = [...this.key.slice(0, k.id-1), k, ...this.key.slice(k.id)]
        this.store.set('default', this.key);
      }) 
      
      //console.log(this.keyboardData[i].frequency)
      //this.service.updateComponent(this.keyboardData[i].frequency)
    }

    let subscriptoin = this.bluetoothModule.dataInOut('shiftkey').subscribe(async r=>{
       if(r.charAt(0)=='p' || r.charAt(0)=='n'){
        let event
         let idx
         if(this.prevIdx || this.prevKey){
          if(r.charAt(0)=='p'){
            idx = this.prevIdx -1
            event = document.querySelector('.key'+ idx)
            //event = event.previousSibling
          }
          else{
            idx = this.prevIdx +1
            event = document.querySelector('.key'+idx)
            //event = event.nextSibling
          }
         }
         else{
          idx = 0
           event = document.querySelector('.list')
         }
         
         this.onPianoKeyPress(event,idx)
       }
     })
    
  }
    // set to landscape
  async onPianoKeyPress(event,idx){ //on pianoKey press
      this.service.updateComponent(idx)
     this.keyboardData[idx].color = this.keyboardData[idx].color+'Active'
     if(this.prevKey){        
        this.keyboardData[this.prevIdx].color = this.keyboardData[this.prevIdx].color.substring(0,5)
        let prevDialogue = this.prevKey.nextSibling
        let animation = this.dialogueAnimation(prevDialogue, 300, 0, 'ease-out',0,0, "none")
        // creating reverse animation to closes the dialogue when key released
        animation.play();
       /* this.service.removeComponent() */
        if(idx == this.prevIdx)
        {
          this.prevIdx = undefined
          this.prevKey = undefined
          this.width = 3330
          return
        }
        
      }
      
      this.width = 3630
      const dialogue = event.nextSibling
     /* this.service.setRootViewContainerRef(this.widgetTargets.toArray()[idx])
      this.service.addDynamicComponent()*/      
      // creating animation to open the dialogue when key pressed
     
      let animation = this.dialogueAnimation(dialogue, 0, 300, 'ease-in', 0,1, 'block')
      animation.play();
      dialogue.style.display = 'block';
      // scroll screen to the center
      dialogue.scrollIntoView({
        behavior: "smooth",
        inline: "center"
      });
      this.prevIdx = idx;
      this.prevKey = event;    
  }

  ionViewDidLeave(){
    console.log("jiyye")
    this.screenOrientation.unlock()
  }
  
    // creating animation for dialogue box
  dialogueAnimation(el,fromWidth, toWidth, easing, fromOpacity, toOpacity, display){
        return createAnimation()
        //.beforeStyles({ 'opacity': fromOpacity })
        .addElement(el)
        //.easing(easing)
        .duration(1000)
        //.direction("alternate")
        .fromTo('width', fromWidth+'px', toWidth+'px')
        .fromTo('opacity', fromOpacity, toOpacity)
       // .afterStyles({ 'opacity': toOpacity })
        //.fromTo('transform','scale('+fromScale+')','scale('+toScale+')')
        /*.keyframes([
          { offset: 0, opacity: fromOpacity },
          {offset: 0.9, opacity: fromOpacity},
          { offset: 1, opacity: toOpacity}])*/
  }

}
