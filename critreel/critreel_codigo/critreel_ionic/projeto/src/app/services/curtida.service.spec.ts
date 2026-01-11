import { TestBed } from '@angular/core/testing';

import { CurtidaService } from './curtida.service';

describe('CurtidaService', () => {
  let service: CurtidaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurtidaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
