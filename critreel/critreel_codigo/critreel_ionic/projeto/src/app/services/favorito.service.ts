import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Favorito } from '../model/favorito';
import { Observable } from 'rxjs';
import { Filme } from '../model/filme';

@Injectable({
  providedIn: 'root'
})
export class FavoritoService {

  private apiUrl: string = 'http://localhost:8080/api/v1/favoritos';

  constructor(private http: HttpClient) { }

  // Adicionar filme aos favoritos
  adicionarFavorito(filmeFavorito: Favorito): Observable<Favorito> {
    return this.http.post<Favorito>(this.apiUrl, filmeFavorito);
  }

  // Remover filme dos favoritos
  removerFavorito(filmeFavorito: Favorito): Observable<Favorito> {
    return this.http.delete<Favorito>(`${this.apiUrl}/${filmeFavorito.idUsuario}/${filmeFavorito.idFilme}`);
  }

  // Buscar todos os filmes favoritos de um usuário
  buscarFavoritosPorUsuario(idUsuario: number): Observable<Filme[]> {
    return this.http.get<Filme[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

}