import { TestBed } from '@angular/core/testing';

import { DecibelService } from './decibel.service';

describe('DecibelService', () => {
  let service: DecibelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecibelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
