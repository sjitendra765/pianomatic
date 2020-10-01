import { Injectable, EventEmitter } from '@angular/core';
import {KeyboardData} from '../static/keyboard-dataset';
import {Keyboard} from '../models/piano-keyboard';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  changed: EventEmitter<boolean> = new EventEmitter();
  updatedTemperament: EventEmitter<any> = new EventEmitter();
  name: EventEmitter<string> = new EventEmitter();
  constructor() { }
  
  frequencyUpdated(){
    this.changed.emit(true)
    //this.rootViewContainer.instance.frequency = `223`;
  }
  getFrequencyEmitter() {
    return this.changed;
  }

  loadTemperament(data){
    this.updatedTemperament.emit(data);
  }
  getTemperamentEmitter(){
    return this.updatedTemperament
  }
  nameUpdated(name){
    this.name.emit(name)
  }
  getNameEmitter(){
    return this.name;
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
