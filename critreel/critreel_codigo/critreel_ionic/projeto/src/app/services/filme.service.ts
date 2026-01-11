import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Filme } from '../model/filme';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class FilmeService {

  private apiUrl = 'http://localhost:8080/api/v1/filme';

  constructor(private http: HttpClient, private usuarioService: UsuarioService) { }

  cadastrar(filme: Filme): Observable<any> {
    return this.http.post<any>(this.apiUrl, filme);
  }

  atualizar(filme: Filme): Observable<any> {
    return this.http.put<any>(this.apiUrl, filme);
  }

  buscarPorId(id: number): Observable<Filme> {
    return this.http.get<Filme>(`${this.apiUrl}/${id}`);
  }

  buscarPorUsuario(idUsuario: number): Observable<Filme[]> {
    return this.http.get<Filme[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  buscarTodos(): Observable<Filme[]> {
    return this.http.get<Filme[]>(this.apiUrl);
  }

  excluir(id: number): Observable<void> {
    const usuario = this.usuarioService.buscarAutenticacao();
    const requesterId = usuario?.idUsuario;
    const url = requesterId ? `${this.apiUrl}/${id}?requesterId=${requesterId}` : `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
