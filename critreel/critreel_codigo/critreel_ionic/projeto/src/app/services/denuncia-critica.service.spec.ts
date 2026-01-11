import { TestBed } from '@angular/core/testing';

import { DenunciaCriticaService } from './denuncia-critica.service';

describe('DenunciaCriticaService', () => {
  let service: DenunciaCriticaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DenunciaCriticaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
