import { Component, Input ,OnInit} from '@angular/core';

@Component({
  selector: 'app-key-dialogue',
  templateUrl: './key-dialogue.component.html',
  styleUrls: ['./key-dialogue.component.scss']
})
export class KeyDialogueComponent implements OnInit {
  @Input() frequency:number = 25;
  @Input() name = "A0";
  threshold='';
  imgSrc = "../assets/freq.png";
  constructor(){
    
  }
  ngOnInit(){
    this.threshold = '+'+ (0.01* this.frequency).toFixed(2)
  }
  increaseFreq(){
    this.frequency = this.frequency + (0.01* this.frequency)
    this.frequency = parseFloat(this.frequency.toFixed(2))
    this.threshold = '+'+ (0.01* this.frequency).toFixed(2)
  }
  decreaseFreq(){
    this.frequency = this.frequency - (0.01* this.frequency)
    this.frequency = parseFloat(this.frequency.toFixed(2))
    this.threshold = '-'+ (0.01* this.frequency).toFixed(2)
  }
  
}
