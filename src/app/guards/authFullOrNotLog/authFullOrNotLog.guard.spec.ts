import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authFullOrNotLogGuard } from './authFullOrNotLog.guard';

describe('authFullOrNotLogGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => authFullOrNotLogGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
