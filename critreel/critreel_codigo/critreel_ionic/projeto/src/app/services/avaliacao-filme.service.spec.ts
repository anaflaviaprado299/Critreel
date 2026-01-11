import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AvaliacaoFilmeService } from './avaliacao-filme.service';

describe('AvaliacaoFilmeService', () => {
  let service: AvaliacaoFilmeService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AvaliacaoFilmeService);
    http = TestBed.inject(HttpTestingController);
  });

  it('deve chamar listarPorFilme', () => {
    service.listarPorFilme(1).subscribe();
    const req = http.expectOne('http://localhost:8080/api/v1/avaliacaofilme/filme/1');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
