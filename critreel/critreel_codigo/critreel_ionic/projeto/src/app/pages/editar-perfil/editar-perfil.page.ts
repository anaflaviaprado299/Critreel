import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Arquivo } from 'src/app/model/arquivo';
import { ArquivoService } from 'src/app/services/arquivo.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
  standalone: false,
})
export class EditarPerfilPage implements OnInit {
  usuario: Usuario;
  fotoPerfilTemp: string | null = null;
  private arquivo: Arquivo | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private toastController: ToastController,
    private arquivoService: ArquivoService
  ) {
    this.usuario = new Usuario();
  }

  ionViewWillEnter() {
    this.carregarUsuario();
  }

  ngOnInit() {
    this.carregarUsuario();
  }

  carregarUsuario() {
    const usuarioLogado = this.usuarioService.buscarAutenticacao();
    if (usuarioLogado && usuarioLogado.idUsuario) {
      this.usuarioService.buscarPorId(usuarioLogado.idUsuario).subscribe({
        next: (dados) => {
          this.usuario = dados;
        },
        error: (err) => {
          console.error('Erro ao carregar usuário:', err);
          this.exibirMensagem('Erro ao carregar dados do usuário', 'danger');
        }
      });
    }
  }

  async onAvatarChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Pré-visualização
        this.fotoPerfilTemp = e.target.result;
        // Guarda a imagem em base64 para upload
        const arq = new Arquivo();
        arq.imagem = e.target.result;
        this.arquivo = arq;
      };
      reader.readAsDataURL(file);
    }
  }

  async salvarAlteracoes() {
    // Validação: bio até 100 caracteres (mesma lógica de limite utilizada em escrever-critica)
    const bio = this.usuario?.bioPerfil || '';
    if (bio.length > 100) {
      this.exibirMensagem('A biografia deve ter no máximo 100 caracteres.', 'danger');
      return;
    }

    try {
      // Se uma nova imagem foi selecionada, faz upload e atualiza o campo com a URL retornada
      if (this.arquivo && this.arquivo.imagem) {
        const url = await this.arquivoService.upload(this.arquivo);
        this.usuario.fotoPerfil = url;
      }

      if (this.usuario) {
        this.usuarioService.atualizarPerfil(this.usuario).subscribe({
          next: (usuarioAtualizado) => {
            this.usuarioService.registrarAutenticacao(usuarioAtualizado);
            this.exibirMensagem('Perfil atualizado com sucesso!', 'success');
            // Limpa estado temporário
            this.fotoPerfilTemp = null;
            this.arquivo = null;
            this.router.navigate(['/perfil']);
          },
          error: (err) => {
            console.error('Erro ao atualizar perfil:', err);
            this.exibirMensagem('Erro ao atualizar perfil', 'danger');
          }
        });
      }
    } catch (erro) {
      console.error('Erro ao fazer upload da imagem:', erro);
      this.exibirMensagem('Erro ao enviar a imagem. Tente novamente.', 'danger');
    }
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
