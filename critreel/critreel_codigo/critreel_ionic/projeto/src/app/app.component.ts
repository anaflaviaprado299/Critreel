import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UsuarioService } from './services/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private menuController: MenuController, private router: Router, private usuarioService: UsuarioService) { }

  menu = [
    { descricao: "Tela principal", rota: "/tela-principal", icone: "home", cor: "#0641a7ff" },
    { descricao: "Meus Filmes", rota: "/meus-filmes", icone: "film", cor: "#0641a7ff" },
    { descricao: "Minhas Críticas", rota: "/minhas-criticas", icone: "pencil", cor: "#0641a7ff" },
    { descricao: "Favoritos", rota: "/favoritos", icone: "star", cor: "#0641a7ff" },
    { descricao: "Perfil", rota: "/perfil", icone: "person", cor: "#0641a7ff" },
    { descricao: "Sair", rota: "/index", icone: "exit", cor: "danger", sair: true }
  ];

  ngOnInit(): void {
    // Exibir item Admin no menu apenas para usuários administradores
    const usuario = this.usuarioService.buscarAutenticacao();
    const jaPossuiAdmin = this.menu.some(m => m.rota === '/admin');
    if (usuario && usuario.admin === true && !jaPossuiAdmin) {
      const idxSair = this.menu.findIndex(m => m.sair === true);
      const adminItem = { descricao: 'Admin', rota: '/admin', icone: 'shield-checkmark', cor: '#0641a7ff' } as any;
      if (idxSair >= 0) {
        this.menu.splice(idxSair, 0, adminItem);
      } else {
        this.menu.push(adminItem);
      }
    }
  }

  closeMenu() {
    this.menuController.close();
  }

  onMenuClick(item: any) {
    if (item.sair) {
      this.usuarioService.encerrarAutenticacao();
    }
    this.router.navigate([item.rota]);
    this.closeMenu();
  }
}

