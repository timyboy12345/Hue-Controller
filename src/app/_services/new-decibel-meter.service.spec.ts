import { TestBed } from '@angular/core/testing';

import { NewDecibelMeterService } from './new-decibel-meter.service';

describe('NewDecibelMeterService', () => {
  let service: NewDecibelMeterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewDecibelMeterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
