import { Component, OnInit,Renderer2, ElementRef, ViewChild,Inject,
  ViewContainerRef  } from '@angular/core';
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

  @ViewChild('dialogue', { 
    read: ViewContainerRef 
  }) viewContainerRef: ViewContainerRef
  service: any;

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
    onKeyPress(event){
      const div = this.renderer.createElement('li');
      const text = this.renderer.createText('Hello world!');
      const parent = this.renderer.parentNode(event.target)
      const child = this.renderer.nextSibling(event.target)
      this.renderer.appendChild(div, text);
      const cuEl = this.renderer.insertBefore(parent,div,child);
      const newEl = this.renderer.nextSibling(event.target )
      this.renderer.addClass(newEl, 'dialogue');*/
    /*
     this.service.setRootViewContainerRef(this.viewContainerRef)
    this.service.addDynamicComponent()
    */
    }

}
