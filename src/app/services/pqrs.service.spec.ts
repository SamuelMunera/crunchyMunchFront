import { TestBed } from '@angular/core/testing';

import { PqrsService } from './pqrs.service';

describe('PqrsService', () => {
  let service: PqrsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PqrsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
