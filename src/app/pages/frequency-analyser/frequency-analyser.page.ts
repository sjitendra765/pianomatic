import { Component, OnInit } from '@angular/core';
import {FrequencyAnalyzerService} from '../../providers/frequency-analyzer.service'

@Component({
  selector: 'app-frequenxy-analyser',
  templateUrl: './frequency-analyser.page.html',
  styleUrls: ['./frequency-analyser.page.scss'],
})
export class FrequencyAnalyserPage implements OnInit {
  constructor(private frequencyAnalyser: FrequencyAnalyzerService) {
   }

  ngOnInit() {
  }

  record(){
    var that = this;
    const audioContext = new window.AudioContext();
    const analyser = audioContext.createAnalyser();
    // fftsize/sampleate = peroid of
    analyser.fftSize = 4096;
    navigator.mediaDevices.getUserMedia(
                          {audio: true})
                          .then(stream => audioContext.createMediaStreamSource(stream).connect(analyser))
                          .catch(err => console.log(err));
    const dataArray = new Float32Array(analyser.frequencyBinCount);
    const period =  (analyser.fftSize / audioContext.sampleRate) * 1000;
    
    // this gets called via requestAnimationFrame, so runs roughly every time the data buffer is refreshed
    setInterval(function () {
      analyser.getFloatTimeDomainData(dataArray);
      var ac = that.frequencyAnalyser.autoCorrelate(dataArray, audioContext.sampleRate)
      console.log(ac)
      if (ac == -1) {
      } else {
        var pitch = ac
        var note =  that.frequencyAnalyser.noteFromPitch( pitch );
        console.log("note", note)
       var detune = that.frequencyAnalyser.centsOffFromPitch( pitch, note );
       console.log("detune", detune)
     }
  }, period);

  }

  stop(){

  }

}
