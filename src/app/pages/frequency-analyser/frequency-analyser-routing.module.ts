import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FrequencyAnalyserPage } from './frequency-analyser.page';

const routes: Routes = [
  {
    path: '',
    component: FrequencyAnalyserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrequencyAnalyserPageRoutingModule {}
