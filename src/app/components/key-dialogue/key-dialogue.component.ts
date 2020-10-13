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
    this.displayFreq = await this.getNumVal((parseInt(this.keyData.frequency)).toFixed())
    this.displayThreshold = '-' + await this.getNumVal(this.threshold)
    this.keyboard.getTemperamentEmitter().subscribe(d=>{      
      if(this.keyData.id == d[this.keyData.id -1].id){
        this.keyData.frequency = parseFloat(d[this.keyData.id -1].frequency.toFixed())
        this.displayFreq = parseFloat(d[this.keyData.id -1].frequency.toFixed())
      }
      
    })

  }
  ionViewWillEnter(){

  }
  ngOnChanges(change: SimpleChanges){
    console.log(change)
  }
  async startRecording(i){
    // Vertical Canvas Begins
    let canvasV = <HTMLCanvasElement> document.querySelector('.vertical'+this.keyData.id);
    let ctxV = canvasV.getContext("2d");
    canvasV.width = 50;
    canvasV.height = 220
   // ctxV.fillStyle = "black";
    //ctxV.fillRect(0, 0, canvasV.width, canvasV.height);
    ctxV.lineWidth = 8;
    //ctxV.beginPath();
    //ctxV.moveTo(25, 220);
    //ctxV.lineTo(25, 150);
    var path2 = new Path2D();
    path2.moveTo(25, 220);
    path2.lineTo(25, 150);
    ctxV.lineCap = "round";
    
    ctxV.strokeStyle = "#FFC400"
    ctxV.fillStyle = "#FFC400";
    ctxV.stroke(path2);
    
    ctxV.font = "12px display";
    ctxV.fillText("0", 35, 220);
    ctxV.fillText("27", 35, 180);
    ctxV.fillText("39", 35, 125);
    ctxV.fillText("45", 35, 40);
    ctxV.stroke();
    
    // Vertical Canvas Ends

    /*
      Horizontal Canvas begins
    */
    let canvas = <HTMLCanvasElement> document.querySelector('.visualizer'+this.keyData.id);
    let ctx = canvas.getContext("2d");
    
    canvas.width = 270;
    canvas.height = 68;
    ctx.strokeStyle = "red"
    
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(138, 28);
    ctx.lineTo(70, 28);
    ctx.font = "15px display";
    ctx.fillStyle = "#FFC400";
    ctx.fillText("0", 135, 55);
    ctx.fillText("-20", 65, 55);
    ctx.fillText("-50", 5 , 55);
    ctx.fillText("20", 182, 55);
    ctx.fillText("50", 248, 55);
    ctx.stroke();    
    
    var path1 = new Path2D();
    path1.moveTo(70, 28);
    path1.lineTo(70, 28);
    ctx.lineCap = "round";
    ctx.stroke(path1);
    /* 
      Horizontal Canvas Ends
    */
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
    this.keyData.frequency = this.keyData.frequency + 1
    
    //this.freq = this.keyData.frequency.toLocaleString("es-ES",{minimumFractionDigits: 2})
    
    this.keyData.frequency = parseFloat(this.keyData.frequency.toFixed())
    this.threshold = parseFloat((0.01* this.keyData.frequency).toFixed())
    this.displayFreq = await this.getNumVal(this.keyData.frequency) 
    this.displayThreshold = '+' + await this.getNumVal(this.threshold)
    this.newKeyData.emit(this.keyData);
    this.keyboard.frequencyUpdated()
  }
  async decreaseFreq(){
    //this.keyData.frequency = this.keyData.frequency - (0.01* this.keyData.frequency)
    this.keyData.frequency = this.keyData.frequency - 1

    this.keyData.frequency = parseFloat(this.keyData.frequency.toFixed())
    this.threshold = parseFloat((0.01* this.keyData.frequency).toFixed())
    this.displayFreq = await this.getNumVal(this.keyData.frequency)
    this.displayThreshold = '-' + await this.getNumVal(this.threshold)
    this.newKeyData.emit(this.keyData);
    this.keyboard.frequencyUpdated()
  }
  
  async getNumVal(val){
    try{
      let getVal = await this.globalization.getPreferredLanguage();
      let lang = getVal.value;
      if(getVal.value.substring(0,2) == 'es')
      lang = "es-ES"
      return val.toLocaleString( lang)
    }catch(err){
      return val
    }
  }

  
}
