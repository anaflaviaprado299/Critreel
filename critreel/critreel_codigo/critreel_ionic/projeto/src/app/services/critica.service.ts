import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Critica } from '../model/critica';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class CriticaService {

 private apiUrl = 'http://localhost:8080/api/v1/critica';

  constructor(private http: HttpClient, private usuarioService: UsuarioService) { }

  adicionar(critica: Critica): Observable<Critica> {
    return this.http.post<Critica>(this.apiUrl, critica);      
  }

  editar(critica: Critica): Observable<Critica> {
    return this.http.put<Critica>(this.apiUrl, critica);
  }

  buscarPorId(id: number): Observable<Critica> {
    return this.http.get<Critica>(`${this.apiUrl}/${id}`);
  }

  buscarTodas(): Observable<Critica[]> {
    return this.http.get<Critica[]>(this.apiUrl);
  }

  buscarPorUsuario(idUsuario: number): Observable<Critica[]> {
    return this.http.get<Critica[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  buscarPorFilme(idFilme: number): Observable<Critica[]> {
    return this.http.get<Critica[]>(`${this.apiUrl}/filme/${idFilme}`);
  }

  excluir(id: number): Observable<void> {
    const usuario = this.usuarioService.buscarAutenticacao();
    const requesterId = usuario?.idUsuario;
    const url = requesterId ? `${this.apiUrl}/${id}?requesterId=${requesterId}` : `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
