import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  private dados: any = {};

  constructor() { }

  salvarInfoIniciais(dados: any) {
    this.dados = { ...this.dados, ...dados };
    return {
      subscribe: (callbacks: { next: () => void; error: (err: any) => void; }) => {
        if (this.dados) {
          callbacks.next();
        } else {
          callbacks.error('Erro ao salvar os dados iniciais.');
        }
      }
    };
  }

  getDados() {
    return this.dados;
  }

  limpar() {
    this.dados = {}; // zera tudo
  }

}
