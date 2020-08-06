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
      
      try{
        this.service.removeComponent()
        this.renderer.removeClass(this.prevKey, this.keyboardData[this.prevIdx].color+'Active')
        this.renderer.setAttribute(this.prevKey,'class',this.keyboardData[this.prevIdx].color)
        this.renderer.removeClass(this.renderer.nextSibling(this.prevKey),'opened');
      }
      catch(err){
        console.log(err)
      }
      const parentSpan = this.renderer.parentNode(event.target)
      const ul = this.renderer.parentNode(parentSpan)
      this.renderer.setStyle(ul, 'width','3630px') //increase the width when dialogue box appear

      this.renderer.setAttribute(event.target,'class',this.keyboardData[idx].color+'Active') //remain keypress when key is clicked
      this.service.setRootViewContainerRef(this.widgetTargets.toArray()[idx])
      this.service.addDynamicComponent()
      this.renderer.addClass(this.renderer.selectRootElement('.dialogue'),'opened');
      this.prevIdx = idx;
      this.prevKey = event.target;
      
    
    }

}
