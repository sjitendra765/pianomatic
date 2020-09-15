import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FrequencyAnalyzerService {
  
  MIN_SAMPLES = 0;  // will be initialized when AudioContext is created.
  GOOD_ENOUGH_CORRELATION = 0.9; // this is the "bar" for how close a correlation needs to be
  THRESHOLD_WINDOW_SIZE = 11
  THRESHOLD_MULTIPLIER = 10
  SAMPLE_RATE
  WINDOW_SIZE
  constructor() { }
  /* returns the matched freqeuency
  */
  getFrequency( note ){
    return 440 * Math.pow(2,(note-49)/12);
  }
  /*
    returns the Key name of matched frequency
  */
  getKeyName( frequency ){
    var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
    return Math.round( noteNum ) + 49;
  }
  /*
    returns if the module is analysing or not
  */
  isAnalysing(){}

  noteFromPitch( frequency ) {
    var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
    return Math.round( noteNum ) + 69;
  }
  
  centsOffFromPitch( frequency, note ) {
    return Math.floor( 1200 * Math.log( frequency / this.getFrequency( note ))/Math.log(2) );
  }
  calculateThreshold(spectrum, lastSpectrum){
    var segments_buf = parseInt(this.SAMPLE_RATE) / parseInt(this.WINDOW_SIZE)
    var thresholding_window_size = this.THRESHOLD_WINDOW_SIZE
    var last_spectrum = []
    for(var i=0;i<this.WINDOW_SIZE;i++){
      last_spectrum.push(0)
    } 
    last_spectrum = lastSpectrum
    var last_flux = []
    for(var i=0;i<segments_buf;i++){
      last_flux.push(0)
    }
    //deque(
    //    np.zeros(segments_buf, dtype=np.int16), segments_buf)
    var last_prunned_flux = 0
    //flux = sum([max(spectrum[n] - last_spectrum[n], 0)
    var flux = 0;
    for(var i=0; i< this.WINDOW_SIZE;i++){
      flux += (spectrum[i] > last_spectrum[i]) ? spectrum[i] - last_spectrum[i] :0
    }
    var thresholdFlux = last_flux.slice(segments_buf - thresholding_window_size, segments_buf)
    let average = (array) => array.reduce((a, b) => a + b) / array.length;
    var thresholded = average(thresholdFlux) * this.THRESHOLD_MULTIPLIER;
    var prunned = (thresholded <= flux) ? flux - thresholded : 0
    var peak = (prunned > last_prunned_flux) ? prunned:0
    last_prunned_flux = prunned
    return peak ;
    /*
      self._last_flux.append(flux)

        thresholded = np.mean(
            self._get_flux_for_thresholding()) * THRESHOLD_MULTIPLIER
        prunned = flux - thresholded if thresholded <= flux else 0
        peak = prunned if prunned > self._last_prunned_flux else 0
        self._last_prunned_flux  = prunned
        return peak
    */
    //  for n in xrange(self._window_size)])
    if(thresholding_window_size <= segments_buf){

    }
  }
  autoCorrelate( buf, sampleRate ) {
    this.SAMPLE_RATE = sampleRate
    var SIZE = buf.length;
    var MAX_SAMPLES = Math.floor(SIZE/2);
    this.WINDOW_SIZE = SIZE
    var best_offset = -1;
    var best_correlation = 0;
    var rms = 0;
    var foundGoodCorrelation = false;
    var correlations = new Array(MAX_SAMPLES);
  
    for (var i=0;i<SIZE;i++) {
      var val = buf[i];
      rms += val*val;
    }
    rms = Math.sqrt(rms/SIZE);
    //rms = Math.sqrt(rms/BUFFER_SIZE);
    if (rms<0.01) // not enough signal
      return -1;
  
    var lastCorrelation=1;
    for (var offset = this.MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
      var correlation = 0;
  
      for (var i=0; i<MAX_SAMPLES; i++) {
        correlation += Math.abs((buf[i])-(buf[i+offset]));
      }
      correlation = 1 - (correlation/MAX_SAMPLES);
      correlations[offset] = correlation; // store it, for the tweaking we need to do below.
      if ((correlation>this.GOOD_ENOUGH_CORRELATION) && (correlation > lastCorrelation)) {
        foundGoodCorrelation = true;
        if (correlation > best_correlation) {
          best_correlation = correlation;
          best_offset = offset;
        }
      } else if (foundGoodCorrelation) {
        // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
        // Now we need to tweak the offset - by interpolating between the values to the left and right of the
        // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
        // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
        // (anti-aliased) offset.
  
        // we know best_offset >=1, 
        // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
        // we can't drop into this clause until the following pass (else if).
        var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];  
        return sampleRate/(best_offset+(8*shift));
      }
      lastCorrelation = correlation;
    }
    if (best_correlation > 0.01) {
      // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
      return sampleRate/best_offset;
    }
    return -1;
  //	var best_frequency = sampleRate/best_offset;
  }
}
