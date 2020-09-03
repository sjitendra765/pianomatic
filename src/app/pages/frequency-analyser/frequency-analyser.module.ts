import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FrequencyAnalyserPageRoutingModule } from './frequency-analyser-routing.module';

import { FrequencyAnalyserPage } from './frequency-analyser.page';
import {FrequencyAnalyzerService} from '../../providers/frequency-analyzer.service'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FrequencyAnalyserPageRoutingModule
  ],
  providers: [FrequencyAnalyzerService],
  declarations: [FrequencyAnalyserPage]
})
export class FrequencyAnalyserPageModule {}
