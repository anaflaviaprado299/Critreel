import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CadastroService } from '../services/cadastro.service';

@Injectable({
  providedIn: 'root'
})

export class CadastroGuard implements CanActivate {

  constructor(private cadastroService: CadastroService, private router: Router) {}

  canActivate(): boolean {
    if (Object.keys(this.cadastroService.getDados()).length === 0) {
      // Redireciona para tela de cadastro com aviso
      this.router.navigate(['/criar-conta'], { queryParams: { erro: 'dados-perdidos' } });
      return false;
    }
    //DESCOMENTAR DEPOIS DE TESTAR
    return true;
  }
}