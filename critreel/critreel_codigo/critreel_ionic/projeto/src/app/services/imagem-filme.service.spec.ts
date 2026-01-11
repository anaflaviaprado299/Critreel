import { TestBed } from '@angular/core/testing';

import { ImagemFilmeService } from './imagem-filme.service';

describe('ImagemFilmeService', () => {
  let service: ImagemFilmeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagemFilmeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
