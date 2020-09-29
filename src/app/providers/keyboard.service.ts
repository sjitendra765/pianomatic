import { Injectable, EventEmitter } from '@angular/core';
import {KeyboardData} from '../static/keyboard-dataset';
import {Keyboard} from '../models/piano-keyboard';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  changed: EventEmitter<boolean> = new EventEmitter();
  constructor() { }
  
  updateFrequency(){
    this.changed.emit(true)
    //this.rootViewContainer.instance.frequency = `223`;
  }
  getFrequencyEmitter() {
    return this.changed;
  }
  getFrequencies(): Keyboard[]{
    //get keyboard frequencies table
    return KeyboardData;
  }
  saveFrequencies(data: any):void{
    //save keyboard frequencies update
    //[...KeyboardData, {data}]
  }
}
