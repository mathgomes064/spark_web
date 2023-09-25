import { TestBed } from '@angular/core/testing';

import { UpdateTipoItemAtributoServiceService } from './update-tipo-item-atributo-service.service';

describe('UpdateTipoItemAtributoServiceService', () => {
  let service: UpdateTipoItemAtributoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateTipoItemAtributoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
