import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { TemperamentComponent } from '../temperament/temperament.component';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import {KeyboardService} from '../../providers/keyboard.service'
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { from } from 'rxjs';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.scss'],
})
export class MainmenuComponent implements OnInit {
  show:boolean= false;
  changed:boolean = false;
  showSave:boolean= false;
  store;
  name:string;
  currentTempo;
  constructor( private file: File,private fileChooser: FileChooser,private filePath: FilePath, private popoverController: PopoverController ,private socialSharing: SocialSharing, private translate: TranslateService,private keyboard: KeyboardService, public toastController: ToastController, private storage: Storage,) {
    this.store = storage
   }

  async ngOnInit() {
    this.keyboard.getFrequencyEmitter().subscribe(r=>{
      this.changed = r;
    })
    this.currentTempo = await this.store.get('name')
    
  }
  writeJSON(filename, object) {
    return this.file.writeFile(this.file.externalRootDirectory, filename, JSON.stringify(object), {replace:true})
    }
  
  async openTemperament(ev){
    this.showSave = false;
    if(this.changed){
      this.currentTempo = this.currentTempo+'*';
      this.showSave = true
      return    
    }
    this.show = false;
    this.changed = false;
    this.currentTempo = this.currentTempo.replace(/\*\s*$/, "");
    const popover = await this.popoverController.create({
      component: TemperamentComponent,
      event: ev,
      cssClass: 'popover_class',
    });
    return await popover.present();
  }
  openInput(){
    this.show = !this.show;
  }
  save(){
    this.show  = false;
    this.showSave = false;
    this.changed = false;
    this.currentTempo = this.currentTempo.replace(/\*\s*$/, "");
    this.store.get('default').then(val=>{
      this.store.set(this.name,val)
      this.store.remove('default')
    })
    this.presentToast(this.name +' '+this.translate.instant('TEMPERAMENT_SAVED'),'primary')
    
   // window.location.reload()
  }
  importSetting(){
    var data;
    this.fileChooser.open()
    .then(uri =>{ console.log(uri)
      this.filePath.resolveNativePath(uri)
      .then(async filePath => {console.log("filepath",filePath)
        var filename = /[^/]*$/.exec(filePath)[0];
        if((filename.split('.')[1]).toUpperCase() != 'JSON'){
          this.presentToast(this.translate.instant('IMPORT_ERROR'),"danger")
          return;
        }
        var path = filePath.slice(0,-(filename.length+1))
        data = await this.file.readAsText(path, filename)
        data = JSON.parse(data)
        console.log(data)
        await this.store.set(filename.split('.')[0],data)
        await this.store.set('name', filename.split('.')[0])
        await this.presentToast(this.translate.instant('IMPORT_TEMPERAMENT'),"primary");
        window.location.reload();
      })
      .catch(err => console.log(err));
   
    })
    .catch(e => console.log(e));
  }

  async exportSetting(){
    var currentJson = await this.store.get(this.currentTempo)
    this.writeJSON( this.currentTempo + '.json', currentJson)
    var filepath = this.file.externalRootDirectory + '/'+ this.currentTempo+'.json';
    var options = {
      message: 'This from pianomatic', // not supported on some apps (Facebook, Instagram)
      subject: 'painomatic exports file', // fi. for email
      files: [filepath], // an array of filenames either locally or remotely
    };
    this.socialSharing.canShareViaEmail().then(() => {
      this.socialSharing.shareWithOptions(options).then((r) => {
        console.log(r)
      }).catch((err) => {
        // Error!
        console.log(err)
      });
    }).catch((err) => {
      // Sharing via email is not possible
      console.log(err)
    });
  }
  async presentToast(message,color) {
    let toast =await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: color
    });
  
    toast.onDidDismiss();
  
    toast.present();
  }
}
