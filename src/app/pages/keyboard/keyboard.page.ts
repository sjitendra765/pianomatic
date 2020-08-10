import { Component, OnInit,Renderer2, ElementRef, ViewChild,Inject,
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
  dialogueWidth: number;
  constructor(
    private screenOrientation: ScreenOrientation, platform:Platform, private renderer: Renderer2, private el: ElementRef, @Inject(Service) service, 
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
      this.renderer.setAttribute(event.target,'class',this.keyboardData[idx].color+'Active') //remain keypress when key is clicked
      try{        
        this.renderer.removeClass(this.prevKey, this.keyboardData[this.prevIdx].color+'Active')
        this.renderer.setAttribute(this.prevKey,'class',this.keyboardData[this.prevIdx].color)
        var prevDialogue = this.renderer.nextSibling(this.prevKey)
        let animation = createAnimation()
        .addElement(prevDialogue)
        .easing("ease-in-out")
        .duration(1000)
        .direction("alternate")
        .fromTo('width', '300px', '0')
        .afterStyles({
          'background': 'green'
        }).fromTo('transform','scale(1)','scale(0.25)')
        //.iterations(Infinity)
        await animation.play();
        this.service.removeComponent()         
        
      }
      catch(err){
        console.log(err)
      }
      const parentSpan = this.renderer.parentNode(event.target)
      const ul = this.renderer.parentNode(parentSpan)
      this.renderer.setStyle(ul, 'width','3630px') //increase the width when dialogue box appear
      const dialogue = this.renderer.nextSibling(event.target)
      this.service.setRootViewContainerRef(this.widgetTargets.toArray()[idx])
      this.service.addDynamicComponent()
      
      // creating animation to open the dialogue when key pressed
      let animation = createAnimation()
        .addElement(dialogue)
        .easing("ease-in-out")
        .duration(1000)
        .direction("alternate")
        .fromTo('width', '0px', '300px')
        .afterStyles({
          'background': 'green'
        }).fromTo('transform','scale(0.25)','scale(1)')
        //.iterations(Infinity)
      animation.play();
      // scroll screen to the center
      dialogue.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      this.prevIdx = idx;
      this.prevKey = event.target;    
    
    }

}
