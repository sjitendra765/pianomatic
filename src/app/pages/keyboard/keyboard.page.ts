import { Component, OnInit,Renderer2, ElementRef, ViewChild,Inject,
  ViewContainerRef,  
  QueryList,
  ViewChildren} from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import {KeyboardData} from '../../static/keyboard-dataset';
import {Keyboard} from '../../models/piano-keyboard';
import { Platform } from '@ionic/angular';
import {Service} from '../../providers/dialogueBox.service'

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
      }
      catch(err){
        console.log(err)
      }
      this.renderer.setAttribute(event.target,'class',this.keyboardData[idx].color+'Active') //remain keypress when key is clicked
      console.log(this.renderer.parentNode(this.renderer.selectRootElement('li')))
      this.service.setRootViewContainerRef(this.widgetTargets.toArray()[idx])
      this.service.addDynamicComponent()
      this.prevIdx = idx;
      //this.service.setRootViewContainerRef(this.viewContainerRef)
      //this.service.addDynamicComponent()
    
    }

}
