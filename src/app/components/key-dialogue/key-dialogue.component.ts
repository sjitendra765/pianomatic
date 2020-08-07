import { Component, Renderer2, OnDestroy, OnInit } from '@angular/core';
import { createAnimation } from "@ionic/core";

@Component({
  selector: 'app-key-dialogue',
  templateUrl: './key-dialogue.component.html',
  styleUrls: ['./key-dialogue.component.scss']
})
export class KeyDialogueComponent implements OnInit,OnDestroy  {
  constructor(private renderer: Renderer2){
    console.log("test in constuctor")
  }
  ngOnInit(){  
    /*const animation = createAnimation()
    .addElement(document.querySelector(".dialogue"))
    .easing("ease-in-out")
    .duration(1000)
    .direction("alternate")
    .fromTo('width', '0px', '300px')
    //.iterations(Infinity)
    .keyframes([
    { offset: 0, transform: "scale(0.25)", opacity: "1" },
    { offset: 1, transform: "scale(1)", opacity: "0.5"}
  ]);

  animation.play();*/
  }
  async ngOnDestroy(){
   /* console.log("destriyes")
    var dialogue = this.renderer.selectRootElement(".box")
    console.log(dialogue)
    const animation = createAnimation()
        .addElement(dialogue)
        .easing("ease-in-out")
        .duration(1000)
        .direction("alternate")
        .fromTo('width', '300px', '0')
        .afterStyles({
          'background': 'green'
        }).fromTo('transform','scale(1)','scale(0)')
        //.iterations(Infinity)
      await animation.play();*/
  }
}
