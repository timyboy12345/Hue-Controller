import { TestBed } from '@angular/core/testing';

import { ColorConverterService } from './color-converter.service';

describe('ColorconverterService', () => {
  let service: ColorConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
