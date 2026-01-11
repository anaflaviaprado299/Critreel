import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { cadastroGuard } from './cadastro.guard';

describe('cadastroGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => cadastroGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
