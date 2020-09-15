import { Injectable } from '@angular/core';
import { BluetoothService } from './bluetooth.service'
import { FrequencyAnalyzerService } from './frequency-analyzer.service'
import { Observable, Subscription, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TunerControllerService {
  private reader: Observable<any>;
  constructor(private Bluetooth: BluetoothService, private FrequencyAnalser: FrequencyAnalyzerService) { 
  }
  /*
    returns if 1 if device is busy doing stuff and 
    0 if it is available to get instaruction
  */
  isBusy(){
    return new Observable(observer => {
      this.reader = this.Bluetooth.dataInOut('0')
      this.reader.subscribe(data => {
        observer.next(data);
      });
    })
    
  }

  checkFrequency(frequency ,idx){
    
  }
}
