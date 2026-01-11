import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Seguidor } from '../model/seguidor';
import { Usuario } from '../model/usuario';

@Injectable({ providedIn: 'root' })
export class SeguidorService {
  private apiUrl = 'http://localhost:8080/api/v1/seguidores';

  constructor(private http: HttpClient) {}

  alternar(seguidor: Seguidor): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, seguidor);
  }

  verificar(idSeguidor: number, idSeguido: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verificar/${idSeguidor}/${idSeguido}`);
  }

  contarSeguidores(idUsuario: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${idUsuario}/contar/seguidores`);
  }

  contarSeguindo(idUsuario: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${idUsuario}/contar/seguindo`);
  }

  listarSeguidores(idUsuario: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/${idUsuario}/seguidores`);
  }

  listarSeguindo(idUsuario: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/${idUsuario}/seguindo`);
  }
}
