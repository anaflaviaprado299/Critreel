import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  canActivate(): boolean {
    const usuario = this.usuarioService.buscarAutenticacao();
    if (usuario && usuario.admin === true) {
      return true;
    }
    this.router.navigate(['/tela-principal']);
    return false;
  }
}
