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
  canvasCtx;
  recordId;
  drawVisual;
  prevIdx;

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
  }
  ionViewWillEnter(){

  }
  ngOnChanges(change: SimpleChanges){
    console.log(change)
  }
  async startRecording(i){
    let canvas = <HTMLCanvasElement> document.querySelector('.visualizer'+this.keyData.id);
    this.canvasCtx = canvas.getContext("2d");
    const audioContext = new window.AudioContext();

    if(this.keyData.id == i+1 && this.prevIdx!= i+1){      
      const analyser = audioContext.createAnalyser();
      let distortion = audioContext.createWaveShaper();
      analyser.fftSize = 2048
      let getMicrophoneAuth
      try{
      
        await this.diagnostic.requestMicrophoneAuthorization()
        getMicrophoneAuth =await this.diagnostic.isMicrophoneAuthorized();
      }catch(err){
        getMicrophoneAuth = true
      }
      if( getMicrophoneAuth){
        navigator.mediaDevices.getUserMedia(
        {audio: true})
        .then(stream => audioContext.createMediaStreamSource(stream).connect(analyser).connect(distortion).connect(audioContext.destination))
        .catch(err => console.log(err))

        this.analyser = analyser
        this.displayHistogram()
        const dataArray = new Float32Array(analyser.frequencyBinCount);

        let frequencyAnalyser = this.freq
        // this gets called via requestAnimationFrame, so runs roughly every 1s
        let _this  = this;
        let getFreqeuncy = function(){
          _this.recordId = requestAnimationFrame(getFreqeuncy)
          analyser.getFloatTimeDomainData(dataArray);
          let ac = frequencyAnalyser.autoCorrelate(dataArray, audioContext.sampleRate)
          _this.PianoFreq = ac.toFixed(2)
          if(ac.toFixed() == _this.keyData.frequency.toFixed())
          {
            console.log("frequency tuned")
          }
          console.log(ac)
          if (ac == -1) {
          } else {
            let pitch = ac
            let note =  frequencyAnalyser.noteFromPitch( pitch );
            let detune = frequencyAnalyser.centsOffFromPitch( pitch, note );
          }
        }
        getFreqeuncy()
        this.prevIdx = i+1
      } 
    }
    else{
      await audioContext.close();
      window.cancelAnimationFrame(this.recordId)
      window.cancelAnimationFrame(this.drawVisual)
    }
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
      let getVal = await this.globalization.getPreferredLanguage();
      let lang = getVal.value;
      if(getVal.value.substring(0,2) == 'es')
      lang = "es-ES"
      return val.toLocaleString( lang,{minimumFractionDigits: 2})
    }catch(err){
      return val
    }
  }

  displayHistogram(){
    const WIDTH = 200
    const HEIGHT = 100
    this.analyser.fftSize = 256;
    let bufferLengthAlt = this.analyser.frequencyBinCount;
    console.log(bufferLengthAlt);
    let dataArrayAlt = new Uint8Array(bufferLengthAlt);
    let _this = this
     //this.canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    let drawAlt = function() {
      _this.drawVisual = requestAnimationFrame(drawAlt);

        _this.analyser.getByteFrequencyData(dataArrayAlt);

        _this.canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        _this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        let barWidth = (WIDTH / bufferLengthAlt) * 2.5;
        let barHeight;
        let x = 0;

        for(let i = 0; i < bufferLengthAlt; i++) {
          barHeight = dataArrayAlt[i];

          _this.canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
          _this.canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

          x += barWidth + 1;
        }
      };

      drawAlt();
  }
}
