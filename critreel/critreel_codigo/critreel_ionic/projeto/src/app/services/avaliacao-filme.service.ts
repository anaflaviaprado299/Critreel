import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AvaliacaoFilme } from '../model/avaliacao-filme';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoFilmeService {
  private apiUrl = 'http://localhost:8080/api/v1/avaliacaofilme';

  constructor(private http: HttpClient) {}

  // Criar ou atualizar avaliação
  avaliar(av: AvaliacaoFilme): Observable<AvaliacaoFilme> {
    return this.http.post<AvaliacaoFilme>(this.apiUrl, av);
  }

  // Verificar se existe avaliação
  verificar(idUsuario: number, idFilme: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verificar/${idUsuario}/${idFilme}`);
  }

  // Obter avaliação específica (pode retornar 404)
  obter(idUsuario: number, idFilme: number): Observable<AvaliacaoFilme> {
    return this.http.get<AvaliacaoFilme>(`${this.apiUrl}/${idUsuario}/${idFilme}`);
  }

  // Listar avaliações de um filme
  listarPorFilme(idFilme: number): Observable<AvaliacaoFilme[]> {
    return this.http.get<AvaliacaoFilme[]>(`${this.apiUrl}/filme/${idFilme}`);
  }

  // Listar avaliações feitas por um usuário
  listarPorUsuario(idUsuario: number): Observable<AvaliacaoFilme[]> {
    return this.http.get<AvaliacaoFilme[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  // Remover avaliação
  remover(idUsuario: number, idFilme: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idUsuario}/${idFilme}`);
  }
}
