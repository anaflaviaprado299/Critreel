import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Critica } from 'src/app/model/critica';
import { Usuario } from 'src/app/model/usuario';
import { CriticaService } from 'src/app/services/critica.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-minhas-criticas',
  templateUrl: './minhas-criticas.page.html',
  styleUrls: ['./minhas-criticas.page.scss'],
  standalone: false,
})
export class MinhasCriticasPage implements OnInit {
  criticas: Critica[] = [];
  usuarioLogado: Usuario;
  nomeUsuario: string;
  fotoPerfil: string;
  constructor(
    private router: Router,
    private criticaService: CriticaService,
    private usuarioService: UsuarioService,
    private alertController: AlertController
  ) {
    this.usuarioLogado = new Usuario();
    this.nomeUsuario = '';
    this.fotoPerfil = '';
  }

  // Executa quando entra na página
  ionViewWillEnter() {
    this.usuarioLogado = this.usuarioService.buscarAutenticacao();
    if (this.usuarioLogado && this.usuarioLogado.idUsuario) {
      this.carregarCriticasDoUsuario(this.usuarioLogado.idUsuario);
    }
  }

  ngOnInit() {
    this.usuarioLogado = this.usuarioService.buscarAutenticacao();

    if (this.usuarioLogado && this.usuarioLogado.idUsuario) {
      // Busca o nome do usuário
      this.usuarioService.buscarPorId(this.usuarioLogado.idUsuario).subscribe(
        (usuario) => {
          this.nomeUsuario = usuario.username;
          this.fotoPerfil = usuario.fotoPerfil;

        },
        (error) => {
          console.error('Erro ao buscar usuário:', error);
        }
      );
      
          // Busca críticas do usuário
          this.carregarCriticasDoUsuario(this.usuarioLogado.idUsuario);
    }
  }


  carregarCriticasDoUsuario(idUsuario: number) {
    this.criticaService.buscarPorUsuario(idUsuario).subscribe(
      (criticas) => {
        this.criticas = criticas;
      },
      (error) => {
        console.error('Erro ao carregar críticas:', error);
      }
    );
  }

  abrirFilme(idFilme: number | null) {
    if (idFilme) {
      this.router.navigate(['/filme', idFilme]);
    }
  }

  async deletarCritica(idCritica: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message:
        'Tem certeza de que deseja apagar esta crítica? Esta ação não pode ser desfeita.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Apagar',
          handler: () => {
            this.criticaService.excluir(idCritica).subscribe(
              () => {
                console.log('Crítica deletada com sucesso!');
                if (this.usuarioLogado && this.usuarioLogado.idUsuario) {
                  this.carregarCriticasDoUsuario(this.usuarioLogado.idUsuario);
                }
              },
              (error) => {
                console.error('Erro ao deletar crítica:', error);
              }
            );
          },
        },
      ],
    });

    await alert.present();
  }

  editarCritica(idCritica: number) {
    this.router.navigate(['/editar-critica', idCritica]);
  }
}
