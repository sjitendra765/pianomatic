import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-frequenxy-analyser',
  templateUrl: './frequency-analyser.page.html',
  styleUrls: ['./frequency-analyser.page.scss'],
})
export class FrequencyAnalyserPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  record(){
    const audioContext = new window.AudioContext();
    const analyser = audioContext.createAnalyser();
    navigator.mediaDevices.getUserMedia(
                          {audio: true})
                          .then(stream => audioContext.createMediaStreamSource(stream).connect(analyser))
                          .catch(err => console.log(err))


    const dataArray = new Uint8Array(analyser.frequencyBinCount);


 // this gets called via requestAnimationFrame, so runs roughly every 1s
    setInterval(function () {
      analyser.getByteTimeDomainData(dataArray);

      let lastPos = 0;
      let lastItem = 0
      dataArray.forEach((item, i) => {
        // console.log(item,i)
      if (item > 128 && lastItem <= 128) { // we have crossed below the mid point
        const elapsedSteps = i - lastPos; // how far since the last time we did this
        lastPos = i;

        const hertz = 1 / (elapsedSteps / 44100);
        console.log(hertz) // an array of every pitch encountered
    }

   

    lastItem = item;
    });
  }, 1000);

  }

  stop(){

  }

}
