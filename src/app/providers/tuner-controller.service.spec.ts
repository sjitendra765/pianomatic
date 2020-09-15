import { TestBed } from '@angular/core/testing';

import { TunerControllerService } from './tuner-controller.service';

describe('TunerControllerService', () => {
  let service: TunerControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TunerControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
