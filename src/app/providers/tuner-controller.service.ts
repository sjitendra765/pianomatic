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

  checkFrequency(frequency ,actualFrequency){
    return frequency == actualFrequency
    
  }
  calculateSteps(frequency, actualFrequency){
    var flag = 0;
    var precision_per_step =0;  
    var steps = 1;
    var tolerance_degree 
    //over_step_tuning_modifier 5 to 10 %
    while(1)
    {
     var required_frequency = actualFrequency
      var real_frequency = frequency

      if (required_frequency * 1.05 > real_frequency){
        //spin_engine_clockwise(nsteps)
      }
      if (Math.abs(required_frequency - real_frequency) < (required_frequency*0.03) && flag == 1){
        
        // then the key has been tuned properly
        flag = 0;
        steps = 0
      }
        // the frequencies will very rarely match. they have to be very close to each other. 0.03 would be our tolerance degree. (in decimals)
      if(Math.abs(required_frequency - real_frequency) < (required_frequency*0.04)){
        steps++; //this part is very experimental
      }

      if (real_frequency> required_frequency* 1.05){
        flag = 1; 
        //spin_engine_counterclockwise(nsteps)

      }
        
    }
  }
}
