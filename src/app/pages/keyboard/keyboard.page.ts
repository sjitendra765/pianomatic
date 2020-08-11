import { Component, OnInit, ElementRef, ViewChild,Inject,
  ViewContainerRef,  
  QueryList,
  ViewChildren} from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import {KeyboardData} from '../../static/keyboard-dataset';
import {Keyboard} from '../../models/piano-keyboard';
import { Platform } from '@ionic/angular';
import {Service} from '../../providers/dialogueBox.service'
import { createAnimation } from "@ionic/core";

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.page.html',
  styleUrls: ['./keyboard.page.scss'],
})
export class KeyboardPage implements OnInit {
  keyboardData = KeyboardData
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
  
  constructor(
    private screenOrientation: ScreenOrientation, platform:Platform, private el: ElementRef, @Inject(Service) service, 
    @Inject(ViewContainerRef) viewContainerRef)
     { 
      platform.ready().then(() => {
        console.log('Width: ' + platform.width());
        console.log('Height: ' + platform.height());
        this.WIDTH = platform.width();
        this.HEIGHT = platform.height() -1;
      });
      this.service = service
     }
  ngOnInit() {
    console.log(this.keyboardData[0].color)
  }
    // set to landscape
  async onPianoKeyPress(event,idx){ //on pianoKey press
     this.keyboardData[idx].color = this.keyboardData[idx].color+'Active'
     try{        
        this.keyboardData[this.prevIdx].color = this.keyboardData[this.prevIdx].color.substring(0,5)
        var prevDialogue = this.prevKey.nextSibling
        let animation = this.dialogueAnimation(prevDialogue, '300', '0', '1', '0.25', 'ease-in-out')

        // creating reverse animation to closes the dialogue when key released
        await animation.play();
        this.service.removeComponent()         
        
      }
      catch(err){
        console.log(err)
      }
      this.width = 3630
      const dialogue = event.target.nextSibling
      this.service.setRootViewContainerRef(this.widgetTargets.toArray()[idx])
      this.service.addDynamicComponent()      
      // creating animation to open the dialogue when key pressed
      let animation = this.dialogueAnimation(dialogue, '0', '300', '0.25', '1', 'ease-in-out')
      animation.play();
      // scroll screen to the center
      dialogue.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      this.prevIdx = idx;
      this.prevKey = event.target;    
    
  }

    // creating animation for dialogue box
  dialogueAnimation(el,fromWidth, toWidth, fromScale, toScale, easing){
        return createAnimation()
        .addElement(el)
        .easing(easing)
        .duration(1000)
        .direction("alternate")
        .fromTo('width', fromWidth+'px', toWidth+'px')
        .afterStyles({
          'background': 'green'
        }).fromTo('transform','scale('+fromScale+')','scale('+toScale+')')
  }

}
