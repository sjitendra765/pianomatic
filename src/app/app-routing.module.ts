import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'keyboard',
    pathMatch: 'full'
  },
  {
    path: 'keyboard',
    loadChildren: () => import('./pages/keyboard/keyboard.module').then( m => m.KeyboardPageModule)
  },
  {
    path: 'device-permission',
    loadChildren: () => import('./pages/device-permission/device-permission.module').then( m => m.DevicePermissionPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
