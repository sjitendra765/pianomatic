import { Component, Input ,OnInit, Output, EventEmitter} from '@angular/core';
import { TranslateService } from '@ngx-translate/core'
import { Globalization } from '@ionic-native/globalization/ngx';
import {FrequencyAnalyzerService} from '../../providers/frequency-analyzer.service'
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

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
  PianoFreq;

  constructor(private diagnostic: Diagnostic,translate: TranslateService,private globalization: Globalization, private freq: FrequencyAnalyzerService){
    //translate.setDefaultLang('es');    
    this.translate = translate
  }
 async ngOnInit(){
  
    this.threshold = parseFloat((0.01* this.keyData.frequency).toFixed(2))
    this.displayFreq = await this.getNumVal(this.keyData.frequency)
    this.displayThreshold = '-' + await this.getNumVal(this.threshold)
  }
  ionViewWillEnter(){
    
  }
  async increaseFreq(){
    const audioContext = new window.AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048
    var getMicrophoneAuth
    try{
      
      await this.diagnostic.requestMicrophoneAuthorization()
      getMicrophoneAuth =await this.diagnostic.isMicrophoneAuthorized();
    }catch(err){
      getMicrophoneAuth = true
    }
    if( getMicrophoneAuth){
      navigator.mediaDevices.getUserMedia(
        {audio: true})
        .then(stream => audioContext.createMediaStreamSource(stream).connect(analyser))
        .catch(err => console.log(err))


    const dataArray = new Float32Array(analyser.frequencyBinCount);

    var frequencyAnalyser = this.freq
    // this gets called via requestAnimationFrame, so runs roughly every 1s
    var _this  = this;
    setInterval(function () {
      analyser.getFloatTimeDomainData(dataArray);
      var ac = frequencyAnalyser.autoCorrelate(dataArray, audioContext.sampleRate)
      _this.PianoFreq = ac.toFixed(2)
      console.log(ac)
      if (ac == -1) {
      } else {
      var pitch = ac
      var note =  frequencyAnalyser.noteFromPitch( pitch );
      console.log("note", note)
      var detune = frequencyAnalyser.centsOffFromPitch( pitch, note );
      console.log("detune", detune)
      }
    }, 1000);
  }
  
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
