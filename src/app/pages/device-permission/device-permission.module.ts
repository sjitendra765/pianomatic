import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DevicePermissionPageRoutingModule } from './device-permission-routing.module';

import { DevicePermissionPage } from './device-permission.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DevicePermissionPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [DevicePermissionPage]
})
export class DevicePermissionPageModule {}
