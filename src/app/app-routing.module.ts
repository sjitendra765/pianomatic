import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'frequency-analyser',
    pathMatch: 'full'
  },
  {
    path: 'bluetooth',
    loadChildren: () => import('./pages/bluetooth/bluetooth.module').then( m => m.BluetoothPageModule)
  },
  {
    path: 'keyboard',
    loadChildren: () => import('./pages/keyboard/keyboard.module').then( m => m.KeyboardPageModule)
  },
  {
    path: 'device-permission',
    loadChildren: () => import('./pages/device-permission/device-permission.module').then( m => m.DevicePermissionPageModule)
  },
  {
    path: 'frequency-analyser',
    loadChildren: () => import('./pages/frequency-analyser/frequency-analyser.module').then( m => m.FrequencyAnalyserPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
