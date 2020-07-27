import { Injectable } from '@angular/core';
import {KeyboardData} from './keyboard-dataset';
import {Keyboard} from './piano-keyboard';

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
