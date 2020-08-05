import { Component, Renderer2, OnDestroy, OnInit } from '@angular/core';
import { createAnimation } from "@ionic/core";

@Component({
  selector: 'app-key-dialogue',
  templateUrl: './key-dialogue.component.html',
  styleUrls: ['./key-dialogue.component.scss'],
})
export class KeyDialogueComponent implements OnInit  {
  constructor(private renderer: Renderer2){

  }
  ngOnInit(){
    const animation = createAnimation()
    .addElement(document.querySelector(".test1"))
    .easing("ease-in-out")
    .duration(1000)
    .direction("alternate")
    //.iterations(Infinity)
    .keyframes([
    { offset: 0, transform: "scale(1)", opacity: "1" },
    { offset: 1, transform: "scale(1.5)", opacity: "0.5" }
  ]);

animation.play();
  }
}
