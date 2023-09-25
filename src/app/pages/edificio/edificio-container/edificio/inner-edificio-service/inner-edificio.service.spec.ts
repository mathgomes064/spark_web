import { TestBed } from '@angular/core/testing';

import { InnerEdificioService } from './inner-edificio.service';

describe('InnerEdificioService', () => {
  let service: InnerEdificioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InnerEdificioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
