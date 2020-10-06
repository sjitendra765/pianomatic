import { Component, Input ,OnInit, Output, EventEmitter, OnChanges,SimpleChanges} from '@angular/core';
import { TranslateService } from '@ngx-translate/core'
import { Globalization } from '@ionic-native/globalization/ngx';
import {FrequencyAnalyzerService} from '../../providers/frequency-analyzer.service'
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import {Service} from '../../providers/dialogueBox.service'
import {KeyboardService} from '../../providers/keyboard.service';
@Component({
  selector: 'app-key-dialogue',
  templateUrl: './key-dialogue.component.html',
  styleUrls: ['./key-dialogue.component.scss']
})
export class KeyDialogueComponent implements OnInit, OnChanges {
  @Input() index:any
  @Input() keyData:any
  
  @Output() newKeyData = new EventEmitter<any>();
  threshold;
  displayFreq;
  displayThreshold;
  PianoFreq;
  canvasCtx;
  prevIdx;
  constructor(private diagnostic: Diagnostic,private translate: TranslateService,private service:Service, private keyboard:KeyboardService,private globalization: Globalization, private freq: FrequencyAnalyzerService){
    //translate.setDefaultLang('es');    
  }
 async ngOnInit(){
    this.service.getIndexEmitter().subscribe(i=>{
      this.startRecording(i)
    })
    this.threshold = parseFloat((0.01* this.keyData.frequency).toFixed(2))
    this.displayFreq = await this.getNumVal(this.keyData.frequency)
    this.displayThreshold = '-' + await this.getNumVal(this.threshold)
    this.keyboard.getTemperamentEmitter().subscribe(d=>{      
      if(this.keyData.id == d[this.keyData.id -1].id){
        this.keyData.frequency = d[this.keyData.id -1].frequency
        this.displayFreq = d[this.keyData.id -1].frequency
      }
      
    })
  }
  ionViewWillEnter(){

  }
  ngOnChanges(change: SimpleChanges){
    console.log(change)
  }
  async startRecording(i){
    /*
      this.freq.startAnalysing()
      this.freq.histogram(this.canvasCtx)
      this.freq.getFrequencyEmmitter().subscribe(r=>{
      
      })
    */
    if((this.keyData.id == i+1)){    
      if(this.prevIdx == i+1){
        this.prevIdx = undefined
        this.freq.stopAnalysing()
      }  
      else{
        this.freq.startAnalysing();
        this.freq.getFrequencyEmmitter().subscribe(r=>{
          console.log(r)
          this.PianoFreq = r.toFixed(2)
        })
        this.prevIdx = i+1
      } 
    }
    else{
      if(this.prevIdx){
        this.prevIdx = undefined
        this.freq.stopAnalysing()
      }      
    }
  }
  async increaseFreq(){   
  
    //this.keyData.frequency = this.keyData.frequency + (0.01* this.keyData.frequency)
    this.keyData.frequency = this.keyData.frequency + 0.5
    
    //this.freq = this.keyData.frequency.toLocaleString("es-ES",{minimumFractionDigits: 2})
    
    this.keyData.frequency = parseFloat(this.keyData.frequency.toFixed(2))
    this.threshold = parseFloat((0.01* this.keyData.frequency).toFixed(2))
    this.displayFreq = await this.getNumVal(this.keyData.frequency) 
    this.displayThreshold = '+' + await this.getNumVal(this.threshold)
    this.newKeyData.emit(this.keyData);
    this.keyboard.frequencyUpdated()
  }
  async decreaseFreq(){
    //this.keyData.frequency = this.keyData.frequency - (0.01* this.keyData.frequency)
    this.keyData.frequency = this.keyData.frequency - 0.5

    this.keyData.frequency = parseFloat(this.keyData.frequency.toFixed(2))
    this.threshold = parseFloat((0.01* this.keyData.frequency).toFixed(2))
    this.displayFreq = await this.getNumVal(this.keyData.frequency)
    this.displayThreshold = '-' + await this.getNumVal(this.threshold)
    console.log(this.keyData)
    this.newKeyData.emit(this.keyData);
    this.keyboard.frequencyUpdated()
  }
  
  async getNumVal(val){
    try{
      let getVal = await this.globalization.getPreferredLanguage();
      let lang = getVal.value;
      if(getVal.value.substring(0,2) == 'es')
      lang = "es-ES"
      return val.toLocaleString( lang,{minimumFractionDigits: 2})
    }catch(err){
      return val
    }
  }

  
}
