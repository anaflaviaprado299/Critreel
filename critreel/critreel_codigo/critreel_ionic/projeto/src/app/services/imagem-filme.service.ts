import { Injectable } from '@angular/core';
import { ImagemFilme } from '../model/imagem-filme';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagemFilmeService {
  private apiUrl = 'http://localhost:8080/api/v1/imagem-filme';

  constructor(private http: HttpClient) { }

  cadastrar(imagemFilme: ImagemFilme): Observable<any> {
    return this.http.post<any>(this.apiUrl, imagemFilme);
  }

  atualizar(imagemFilme: ImagemFilme): Observable<any> {
    return this.http.put<any>(this.apiUrl, imagemFilme);
  }

  buscarPorId(id: number): Observable<ImagemFilme> {
    return this.http.get<ImagemFilme>(`${this.apiUrl}/${id}`);
  }

  buscarPorIdFilme(id: number): Observable<ImagemFilme[]> {
    return this.http.get<ImagemFilme[]>(`${this.apiUrl}/filme/${id}`);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
