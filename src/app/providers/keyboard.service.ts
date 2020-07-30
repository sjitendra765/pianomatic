import { Injectable } from '@angular/core';
import {KeyboardData} from '../static/keyboard-dataset';
import {Keyboard} from '../models/piano-keyboard';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {

  constructor() { }
  getFrequencies(): Keyboard[]{
    //get keyboard frequencies table
    return KeyboardData;
  }
  saveFrequencies(data: any):void{
    //save keyboard frequencies update
    //[...KeyboardData, {data}]
  }
}
