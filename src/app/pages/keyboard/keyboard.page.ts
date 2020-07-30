import { Component, OnInit } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import {KeyboardData} from '../../static/keyboard-dataset';
import {Keyboard} from '../../models/piano-keyboard';


@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.page.html',
  styleUrls: ['./keyboard.page.scss'],
})
export class KeyboardPage implements OnInit {
  keyboardData = KeyboardData
  
  constructor(
    private screenOrientation: ScreenOrientation)
     { }
  ngOnInit() {
    console.log(this.keyboardData[0].color)
  }
    // set to landscape


}
