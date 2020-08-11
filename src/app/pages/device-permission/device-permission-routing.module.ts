import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevicePermissionPage } from './device-permission.page';

const routes: Routes = [
  {
    path: '',
    component: DevicePermissionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevicePermissionPageRoutingModule {}
