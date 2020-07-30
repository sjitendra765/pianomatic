import { Component, OnInit } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import {KeyboardData} from '../../static/keyboard-dataset';
import {Keyboard} from '../../models/piano-keyboard';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.page.html',
  styleUrls: ['./keyboard.page.scss'],
})
export class KeyboardPage implements OnInit {
  keyboardData = KeyboardData
  public WIDTH: number
  public HEIGHT: number
  constructor(
    private screenOrientation: ScreenOrientation, platform:Platform)
     { 
      platform.ready().then(() => {
        console.log('Width: ' + platform.width());
        console.log('Height: ' + platform.height());
        this.WIDTH = platform.width();
        this.HEIGHT = platform.height() -1;
      });
     }
  ngOnInit() {
    console.log(this.keyboardData[0].color)
  }
    // set to landscape


}
