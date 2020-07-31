import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KeyboardPageRoutingModule } from './keyboard-routing.module';

import { KeyboardPage } from './keyboard.page';
import {KeyDialogueComponent} from '../../components/key-dialogue/key-dialogue.component';
import {Service} from "../../providers/dialogueBox.service"
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KeyboardPageRoutingModule
  ],
  providers: [Service],
  declarations: [KeyboardPage, KeyDialogueComponent],
  entryComponents: [KeyDialogueComponent]
})
export class KeyboardPageModule {}
