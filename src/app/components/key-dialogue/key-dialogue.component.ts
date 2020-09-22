import { Component, Input ,OnInit, Output, EventEmitter, OnChanges,SimpleChanges} from '@angular/core';
import { TranslateService } from '@ngx-translate/core'
import { Globalization } from '@ionic-native/globalization/ngx';
import {FrequencyAnalyzerService} from '../../providers/frequency-analyzer.service'
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import {Service} from '../../providers/dialogueBox.service'
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
  imgSrc = "../assets/freq.png";
  translate;
  displayFreq;
  displayThreshold;
  PianoFreq;
  analyser;
  gainNode;
  distortion;
  canvasCtx;
  recordId;
  drawVisual;
  prevIdx;
  audioContext = null
  constructor(private diagnostic: Diagnostic,translate: TranslateService,private service:Service,private globalization: Globalization, private freq: FrequencyAnalyzerService){
    //translate.setDefaultLang('es');    
    this.translate = translate
  }
 async ngOnInit(){
    this.service.getIndexEmitter().subscribe(i=>{
      this.startRecording(i)
    })
    this.threshold = parseFloat((0.01* this.keyData.frequency).toFixed(2))
    this.displayFreq = await this.getNumVal(this.keyData.frequency)
    this.displayThreshold = '-' + await this.getNumVal(this.threshold)
    this.audioContext = new window.AudioContext();
    this.analyser = this.audioContext.createAnalyser();
      this.distortion = this.audioContext.createWaveShaper();      
      this.gainNode = this.audioContext.createGain();
      
      navigator.mediaDevices.getUserMedia(
        {audio: true})
        .then(stream => this.audioContext.createMediaStreamSource(stream).connect(this.distortion).connect(this.analyser))
        .catch(err => console.log(err))
  }
  ionViewWillEnter(){

  }
  ngOnChanges(change: SimpleChanges){
    console.log(change)
  }
  async startRecording(i){
    let canvas = <HTMLCanvasElement> document.querySelector('.visualizer'+this.keyData.id);
    this.canvasCtx = canvas.getContext("2d");
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
        this.freq.startAnalysing(this.canvasCtx);
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
