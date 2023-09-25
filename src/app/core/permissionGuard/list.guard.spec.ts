import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { listGuard } from './list.guard';

describe('listGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => listGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
