import { TestBed } from '@angular/core/testing';

import { DenunciaFilmeService } from './denuncia-filme.service';

describe('DenunciaFilmeService', () => {
  let service: DenunciaFilmeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DenunciaFilmeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
