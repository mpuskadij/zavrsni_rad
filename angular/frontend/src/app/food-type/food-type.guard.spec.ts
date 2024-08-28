import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { foodTypeGuard } from './food-type.guard';

describe('foodTypeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => foodTypeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
