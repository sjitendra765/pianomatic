import { Component, OnInit } from '@angular/core';
import {FrequencyAnalyzerService} from '../../providers/frequency-analyzer.service'

@Component({
  selector: 'app-frequenxy-analyser',
  templateUrl: './frequency-analyser.page.html',
  styleUrls: ['./frequency-analyser.page.scss'],
})
export class FrequencyAnalyserPage implements OnInit {
  constructor(private freq: FrequencyAnalyzerService) {
   }

  ngOnInit() {
  }

  record(){
    const audioContext = new window.AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048
    navigator.mediaDevices.getUserMedia(
                          {audio: true})
                          .then(stream => audioContext.createMediaStreamSource(stream).connect(analyser))
                          .catch(err => console.log(err))


    const dataArray = new Float32Array(analyser.frequencyBinCount);
    console.log("count",analyser.frequencyBinCount)
    
    var frequencyAnalyser = this.freq
 // this gets called via requestAnimationFrame, so runs roughly every 1s
    setInterval(function () {
      analyser.getFloatTimeDomainData(dataArray);
      var ac = frequencyAnalyser.autoCorrelate(dataArray, audioContext.sampleRate)
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

  stop(){

  }

}
