import { TestBed } from '@angular/core/testing';

import { IceCreamService } from './iceCreams.service';

describe('ToppingsService', () => {
  let service: IceCreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IceCreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
