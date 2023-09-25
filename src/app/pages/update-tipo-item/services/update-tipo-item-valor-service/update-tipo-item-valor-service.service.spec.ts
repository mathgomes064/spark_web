import { TestBed } from '@angular/core/testing';

import { UpdateTipoItemValorServiceService } from './update-tipo-item-valor-service.service';

describe('UpdateTipoItemValorServiceService', () => {
  let service: UpdateTipoItemValorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateTipoItemValorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
