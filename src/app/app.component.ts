import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private globalization: Globalization
  ) {
    this.initTranslate();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  async initTranslate() {
   // this.translate.setDefaultLang('es');
   var lang = 'es'
   try{
     var getVal  = await this.globalization.getPreferredLanguage()
     lang = getVal.value.substring(0,2)
   }catch(err){
     console.log(err)
   }
   this.translate.setDefaultLang(lang);
  }
}
