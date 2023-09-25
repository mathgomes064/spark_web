import { TestBed } from '@angular/core/testing';

import { InnerCompartimentoService } from './inner-compartimento.service';

describe('InnerCompartimentoService', () => {
  let service: InnerCompartimentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InnerCompartimentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
