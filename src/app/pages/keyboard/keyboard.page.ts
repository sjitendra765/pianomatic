import { Component, OnInit, ElementRef, ViewChild,Inject,
  ViewContainerRef,  
  QueryList,
  ViewChildren, OnDestroy} from '@angular/core';
  import { ToastController } from '@ionic/angular';
  import { Router } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import {KeyboardData} from '../../static/keyboard-dataset';
import {Keyboard} from '../../models/piano-keyboard';
import { Platform } from '@ionic/angular';
import {Service} from '../../providers/dialogueBox.service'
import { createAnimation } from "@ionic/core";
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import {BluetoothService} from '../../providers/bluetooth.service'
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { environment } from '../../../environments/environment';


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
  isConnected = "disconnected";
  width = 3330
  dialogueWidth: number;
  store: any;
  constructor(
     private Bluetooth: BluetoothService,private diagnostic: Diagnostic, platform:Platform, private route: Router,private translate: TranslateService ,private storage: Storage, public toastController: ToastController, private el: ElementRef, @Inject(Service) service, 
    @Inject(ViewContainerRef) viewContainerRef)
     { 
      platform.ready().then(() => {
        console.log('Width: ' + platform.width());
        console.log('Height: ' + platform.height());
        if(platform.isLandscape()){
          this.HEIGHT = platform.height()-50;
          this.WIDTH = platform.width()
        }else{
          this.HEIGHT = platform.width();
          this.WIDTH = platform.height() -50;
        }
      });
      this.service = service
      this.store = storage
     }
  async ngOnInit() {
   // console.log(this.keyboardData[0].color)
   //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
   try{
    let getBluetoothAuth = await this.diagnostic.isBluetoothAvailable()
    if(getBluetoothAuth){
      if(!environment.production)
        this.connectPairedDevice()    
    }
  }
  catch(err){
    console.log(err)
  }
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

    let subscriptoin = this.Bluetooth.dataInOut('shiftkey').subscribe(async r=>{
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
  openInfo(){
    this.route.navigate(['/device-permission'])
  }
    // set to landscape
  async onPianoKeyPress(event,idx){ //on pianoKey press
      this.service.updateComponent(idx)
     this.keyboardData[idx].color = this.keyboardData[idx].color+'Active'
     if(this.prevKey){        
        this.keyboardData[this.prevIdx].color = this.keyboardData[this.prevIdx].color.substring(0,5)
        let prevDialogue = this.prevKey.nextSibling
        let animation = this.dialogueAnimation(prevDialogue, 1, 0, 'ease-out',1,0, "none")
        // creating reverse animation to closes the dialogue when key released
        await animation.play();
       /* this.service.removeComponent() */
       prevDialogue.style.display = 'none';
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
     
      let animation = this.dialogueAnimation(dialogue, 0, 1, 'ease-in', 0,1, 'block')
      dialogue.style.display = 'block';
      animation.play()
      // scroll screen to the center
      dialogue.scrollIntoView({
        behavior: "smooth",
        inline: "center"
      });
      this.prevIdx = idx;
      this.prevKey = event;    
  }

  ionViewDidLeave(){
  }
  
    // creating animation for dialogue box
  dialogueAnimation(el,fromScale, toScale, easing, fromOpacity, toOpacity, display){
        return createAnimation()
        //.beforeStyles({ 'opacity': fromOpacity })
        .addElement(el)
        //.easing(easing)
        .duration(1000)
        //.direction("alternate")
        //.fromTo('width', fromWidth+'px', toWidth+'px')
        .fromTo('opacity', fromOpacity, toOpacity)
       // .afterStyles({ 'opacity': toOpacity })
        .fromTo('transform','scaleX('+fromScale+')','scaleX('+toScale+')')
        /*.keyframes([
          { offset: 0, opacity: fromOpacity },
          {offset: 0.9, opacity: fromOpacity},
          { offset: 1, opacity: toOpacity}])*/
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
              this.isConnected = "connected"  
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
        this.presentToast(this.translate.instant(err),'dark')
        this.isConnected = "disconnected" 
      }
            
  }
  async presentToast(message,color) {
    let toast =await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'toast'
    });
  
    toast.onDidDismiss();
  
    toast.present();
  }
}
