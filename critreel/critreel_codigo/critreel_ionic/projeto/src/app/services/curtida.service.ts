import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curtida } from '../model/curtida';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class CurtidaService {
  private apiUrl = 'http://localhost:8080/api/v1/curtidas';

  constructor(private http: HttpClient) { }

  // Alterna entre curtir e descurtir
  alternarCurtida(curtida: Curtida): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, curtida);
  }

  // Buscar usuários que curtiram uma crítica
  buscarUsuariosPorCritica(idCritica: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/critica/${idCritica}`);
  }
}
