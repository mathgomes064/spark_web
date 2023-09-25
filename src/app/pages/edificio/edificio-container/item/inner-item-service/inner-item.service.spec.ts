import { TestBed } from '@angular/core/testing';

import { InnerItemService } from './inner-item.service';

describe('InnerItemService', () => {
  let service: InnerItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InnerItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
