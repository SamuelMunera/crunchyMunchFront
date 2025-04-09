import { TestBed } from '@angular/core/testing';

import { ToppingsService } from './toppings.service';

describe('ToppingsService', () => {
  let service: ToppingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToppingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
