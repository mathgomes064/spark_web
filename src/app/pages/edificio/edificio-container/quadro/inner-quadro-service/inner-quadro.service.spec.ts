import { TestBed } from '@angular/core/testing';

import { InnerQuadroService } from './inner-quadro.service';

describe('InnerQuadroService', () => {
  let service: InnerQuadroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InnerQuadroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
