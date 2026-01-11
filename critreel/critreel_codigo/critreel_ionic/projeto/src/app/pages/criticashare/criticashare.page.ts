import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CriticaService } from 'src/app/services/critica.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';
import { CurtidaService } from 'src/app/services/curtida.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-criticashare',
  templateUrl: './criticashare.page.html',
  styleUrls: ['./criticashare.page.scss'],
  standalone: false
})
export class CriticasharePage implements OnInit {

idCritica: number;
critica: any;
autor: Usuario | null = null;
usuarioLogado: Usuario | null = null;
curtidasCount: number = 0;
curtidaAtiva: boolean = false;

constructor(
  private route: ActivatedRoute,
  private criticaService: CriticaService,
  private usuarioService: UsuarioService,
  private curtidaService: CurtidaService,
  private toastController: ToastController,
  private router: Router
) {
  this.idCritica = 0;
}

ngOnInit() {
  this.idCritica = Number(this.route.snapshot.paramMap.get('idCritica'));
  this.usuarioLogado = this.usuarioService.buscarAutenticacao();
  this.carregarCritica();
}

carregarCritica() {
  this.criticaService.buscarPorId(this.idCritica).subscribe(data => {
    this.critica = data;
    if (this.critica?.idUsuario) {
      this.usuarioService.buscarPorId(this.critica.idUsuario).subscribe({
        next: (usuario) => this.autor = usuario,
        error: () => this.autor = null
      });
    }
    this.carregarCurtidas();
  });
}

carregarCurtidas() {
  if (!this.critica) return;
  this.curtidaService.buscarUsuariosPorCritica(this.critica.idCritica).subscribe({
    next: usuarios => {
      this.curtidasCount = usuarios.length;
      const idLogado = this.usuarioLogado?.idUsuario;
      this.curtidaAtiva = !!usuarios.find(u => u.idUsuario === idLogado);
    },
    error: () => {
      this.curtidasCount = 0;
      this.curtidaAtiva = false;
    }
  });
}

alternarCurtida() {
  if (!this.usuarioLogado || !this.usuarioLogado.idUsuario) {
    this.exibirMensagem('Faça login para curtir críticas', 'warning');
    return;
  }
  if (!this.critica) return;
  const curtidaPayload = { idUsuario: this.usuarioLogado.idUsuario, idCritica: this.critica.idCritica };
  this.curtidaService.alternarCurtida(curtidaPayload).subscribe({
    next: () => {
      this.curtidaAtiva = !this.curtidaAtiva;
      this.curtidasCount += this.curtidaAtiva ? 1 : -1;
    },
    error: () => {
      this.exibirMensagem('Não foi possível curtir agora', 'warning');
    }
  });
}

abrirUsuario() {
  if (this.autor?.idUsuario) {
    this.router.navigate(['/perfil', this.autor.idUsuario]);
  }
}

estaAutenticado(): boolean {
  return this.usuarioService.estaAutenticado();
}

async exibirMensagem(texto: string, cor: string) {
  const toast = await this.toastController.create({
    message: texto,
    duration: 1500,
    color: cor
  });
  toast.present();
}
}
