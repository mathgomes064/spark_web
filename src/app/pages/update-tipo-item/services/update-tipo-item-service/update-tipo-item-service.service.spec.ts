import { TestBed } from '@angular/core/testing';

import { UpdateTipoItemServiceService } from './update-tipo-item-service.service';

describe('UpdateTipoItemServiceService', () => {
  let service: UpdateTipoItemServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateTipoItemServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
