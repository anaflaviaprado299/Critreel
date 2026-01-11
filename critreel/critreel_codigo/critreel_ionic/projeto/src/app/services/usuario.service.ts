import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8080/api/usuario';

  constructor(private http: HttpClient) { }

  cadastrar(usuario: Usuario): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }

  autenticar(email: String, senha: String): Observable<Usuario> {
    const dadosLogin = {
      email: email,
      senha: senha
    };
 
    
    return this.http.post<Usuario>(this.apiUrl+'/autenticar', dadosLogin);
  }

  buscarAutenticacao(): Usuario {
    let usuario = JSON.parse(localStorage.getItem('usuarioAutenticado') || '{}');
    return usuario;
  }

  estaAutenticado(): boolean {
    const usuario = this.buscarAutenticacao();
    return usuario && usuario.idUsuario ? true : false;
  }

  buscarPorId(id: number): Observable<Usuario> {
  return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
}

  registrarAutenticacao(usuario: Usuario) {
    localStorage.setItem('usuarioAutenticado', JSON.stringify(usuario));
  }

  encerrarAutenticacao() {
    localStorage.removeItem('usuarioAutenticado');
  }

  verificarLogin(nomeUsuario: String, email: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.http.get<Usuario[]>(this.apiUrl).subscribe({
        next: (usuarios) => {
          const existe = usuarios.some(u => u.username === nomeUsuario || u.email === email);
          observer.next(existe);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  atualizarPerfil(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}`, usuario);
  }

  buscarTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  excluir(id: number): Observable<void> {
    const usuario = this.buscarAutenticacao();
    const requesterId = usuario?.idUsuario;
    const url = requesterId ? `${this.apiUrl}/${id}?requesterId=${requesterId}` : `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}