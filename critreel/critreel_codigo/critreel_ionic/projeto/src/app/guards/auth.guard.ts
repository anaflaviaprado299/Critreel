import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  canActivate(): boolean {
    if (!this.usuarioService.estaAutenticado()) {
      this.router.navigate(['/index']);
      return false;
    }
    return true;
  }
}
