import { TestBed } from '@angular/core/testing';

import { CrookieService } from './crookie.service';

describe('CrookieService', () => {
  let service: CrookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
