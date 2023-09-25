import { TestBed } from '@angular/core/testing';

import { TipoItemService } from './tipo-item.service';

describe('TipoItemService', () => {
  let service: TipoItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
