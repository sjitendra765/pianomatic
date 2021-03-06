import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import {BluetoothService} from './providers/bluetooth.service'
import {KeyboardService} from './providers/keyboard.service'
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {MainmenuComponent} from './components/mainmenu/mainmenu.component'
import {TemperamentComponent} from './components/temperament/temperament.component'
import {FrequencyAnalyzerService} from './providers/frequency-analyzer.service'
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { IonicStorageModule } from '@ionic/storage';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}
@NgModule({
  declarations: [AppComponent, MainmenuComponent, TemperamentComponent],
  entryComponents: [],
  imports: [BrowserModule,CommonModule, FormsModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), AppRoutingModule, HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })],
  providers: [
    File,
    FileChooser,
    FilePath,
    StatusBar,
    SplashScreen,
    BluetoothSerial,
    ScreenOrientation,
    Globalization,
    Diagnostic,
    FrequencyAnalyzerService,
    OpenNativeSettings,
    SocialSharing,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BluetoothService,
    KeyboardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
