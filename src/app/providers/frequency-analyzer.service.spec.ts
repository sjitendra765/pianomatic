import { TestBed } from '@angular/core/testing';

import { FrequencyAnalyzerService } from './frequency-analyzer.service';

describe('FrequencyAnalyzerService', () => {
  let service: FrequencyAnalyzerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrequencyAnalyzerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
