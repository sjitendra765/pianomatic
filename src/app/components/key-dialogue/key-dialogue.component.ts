import { Component, Input ,OnInit, Output, EventEmitter} from '@angular/core';
import { TranslateService } from '@ngx-translate/core'
import { Globalization } from '@ionic-native/globalization/ngx';
@Component({
  selector: 'app-key-dialogue',
  templateUrl: './key-dialogue.component.html',
  styleUrls: ['./key-dialogue.component.scss']
})
export class KeyDialogueComponent implements OnInit {
  @Input() keyData:any
  @Output() newKeyData = new EventEmitter<any>();
  threshold;
  imgSrc = "../assets/freq.png";
  translate;
  displayFreq;
  displayThreshold;

  constructor(translate: TranslateService,private globalization: Globalization){
    //translate.setDefaultLang('es');    
    this.translate = translate
  }
 async ngOnInit(){
    this.threshold = parseFloat((0.01* this.keyData.frequency).toFixed(2))
    this.displayFreq = await this.getNumVal(this.keyData.frequency)
    this.displayThreshold = '-' + await this.getNumVal(this.threshold)
  }
  async increaseFreq(){
    this.keyData.frequency = this.keyData.frequency + (0.01* this.keyData.frequency)
    //this.freq = this.keyData.frequency.toLocaleString("es-ES",{minimumFractionDigits: 2})
    
    this.keyData.frequency = parseFloat(this.keyData.frequency.toFixed(2))
    this.threshold = parseFloat((0.01* this.keyData.frequency).toFixed(2))
    this.displayFreq = await this.getNumVal(this.keyData.frequency) 
    this.displayThreshold = '+' + await this.getNumVal(this.threshold)
    this.newKeyData.emit(this.keyData);
  }
  async decreaseFreq(){
    this.keyData.frequency = this.keyData.frequency - (0.01* this.keyData.frequency)
    this.keyData.frequency = parseFloat(this.keyData.frequency.toFixed(2))
    this.threshold = parseFloat((0.01* this.keyData.frequency).toFixed(2))
    this.displayFreq = await this.getNumVal(this.keyData.frequency)
    this.displayThreshold = '-' + await this.getNumVal(this.threshold)
    console.log(this.keyData)
    this.newKeyData.emit(this.keyData);
  }
  
  async getNumVal(val){
    try{
      var getVal = await this.globalization.getPreferredLanguage();
      var lang = getVal.value;
      if(getVal.value.substring(0,2) == 'es')
      lang = "es-ES"
      return val.toLocaleString( lang,{minimumFractionDigits: 2})
    }catch(err){
      return val
    }
  }
}
