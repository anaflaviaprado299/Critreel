import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Critica } from 'src/app/model/critica';
import { Usuario } from 'src/app/model/usuario';
import { CriticaService } from 'src/app/services/critica.service';
import { CurtidaService } from 'src/app/services/curtida.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
  standalone: false,
})
export class PostsPage implements OnInit {
  criticas: Critica[];
  usuarioLogado: Usuario;

  // Novas variáveis para controlar o estado visual
  curtidasPorCritica = new Map<number, number>();
  criticasCurtidas = new Map<number, boolean>();
  // PERMITE ARMAZENAR TODOS OS USUARIOS JA BUSCADOS
  private autores = new Map<number, Usuario>();

  constructor(private toastController: ToastController, private router: Router, private curtidaService: CurtidaService, private criticaService: CriticaService, private usuarioService: UsuarioService) {
    this.usuarioLogado = new Usuario();
    this.criticas = [];
  }

  ionViewWillEnter() {
    this.usuarioLogado = this.usuarioService.buscarAutenticacao();
    this.carregarTodasCriticas();
  }

  ngOnInit(): void {
    this.usuarioLogado = this.usuarioService.buscarAutenticacao();
    this.carregarTodasCriticas();
  }

  carregarTodasCriticas() {
    this.criticaService.buscarTodas().subscribe({
      next: (criticas) => {
        this.criticas = criticas || [];
        this.criticas.forEach(critica => {
          if (critica.idUsuario && !this.autores.has(critica.idUsuario)) {
            this.usuarioService.buscarPorId(critica.idUsuario).subscribe({
              next: (usuario) => {
                this.autores.set(critica.idUsuario!, usuario);
              },
              error: (err) => {
                console.error('Erro ao buscar autor:', err);
                // Usuário padrão para erro
                this.autores.set(critica.idUsuario!, {
                  idUsuario: critica.idUsuario,
                  username: 'Usuário',
                  fotoPerfil: 'assets/images/imagemperfil.jpg'
                } as Usuario);
              }
            });
          }

          // Inicializar estado visual de curtidas
          this.curtidaService.buscarUsuariosPorCritica(critica.idCritica).subscribe({
            next: (usuarios) => {
              this.curtidasPorCritica.set(critica.idCritica, usuarios.length);
              // Só verifica se usuário curtiu se estiver logado
              if (this.usuarioLogado && this.usuarioLogado.idUsuario) {
                this.criticasCurtidas.set(critica.idCritica, usuarios.some(u => u.idUsuario === this.usuarioLogado.idUsuario));
              } else {
                this.criticasCurtidas.set(critica.idCritica, false);
              }
            },
            error: (err) => {
              console.error('Erro ao buscar curtidas:', err);
              this.curtidasPorCritica.set(critica.idCritica, 0); // Valor padrão em caso de erro
              this.criticasCurtidas.set(critica.idCritica, false);
            }
          });
        });
      },
      error: (err) => {
        console.error('Erro ao carregar críticas:', err);
        this.criticas = [];
      }
    });
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/imagemperfil.jpg';
  }

   // Métodos para usar no template
  getAutor(idUsuario?: number): Usuario {
    if (!idUsuario) return { username: 'Usuário', fotoPerfil: 'assets/images/imagemperfil.jpg' } as Usuario;
    return this.autores.get(idUsuario) || { username: 'Usuário', fotoPerfil: 'assets/images/imagemperfil.jpg' } as Usuario;
  }

  curtirCritica(idCritica: number) {
    if (!this.usuarioLogado || !this.usuarioLogado.idUsuario) {
      this.exibirMensagem('Faça login para curtir críticas', 'warning');
      return;
    }

    const curtida = {
      idUsuario: this.usuarioLogado.idUsuario,
      idCritica: idCritica
    };

    this.curtidaService.alternarCurtida(curtida).subscribe({
      next: () => {
        const curtido = this.criticasCurtidas.get(idCritica);
        this.criticasCurtidas.set(idCritica, !curtido);

        const curtidasAtual = this.curtidasPorCritica.get(idCritica) || 0;
        this.curtidasPorCritica.set(idCritica, curtido ? curtidasAtual - 1 : curtidasAtual + 1);
      },
      error: (err) => {
        console.error('Erro ao alternar curtida', err);
      }
    });
  }

  abrirUsuario(idUsuario: number) {
    if (idUsuario) {
      this.router.navigate(['/perfil', idUsuario]);
    } else {
      console.error('Erro ao abrir usuário: ID inválido');
      this.exibirMensagem('Erro ao abrir usuário: ID inválido', 'danger');
    }
  }

  abrirFilme(idFilme: number | null) {
    if (idFilme) {
      this.router.navigate(['/filme', idFilme]);
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

  async compartilhar(critica: Critica) {
    const base = window?.location?.origin || '';
    const url = `${base}/criticashare/${critica.idCritica}`;

    // 1) Tenta compartilhar nativamente via Capacitor (quando disponível)
    try {
      const hasCapacitor = (window as any).Capacitor?.isNativePlatform?.();
      if (hasCapacitor) {
        // @ts-ignore: módulo opcional, só presente em builds com Capacitor plugin instalado
        const { Share } = await import('@capacitor/share');
        await Share.share({
          title: 'Crítica no CritReel',
          text: critica.texto,
          url
        });
        return;
      }
    } catch (e) {
      // Se plugin não instalado ou erro, continua para fallback web
    }

    // 2) Tenta usar a Web Share API do navegador
    if (navigator && 'share' in navigator) {
      try {
        await (navigator as any).share({
          title: 'Crítica no CritReel',
          text: critica.texto,
          url
        });
        return;
      } catch {
        // Usuário cancelou ou falhou — segue para copiar link
      }
    }

    // 3) Fallback: copia o link para a área de transferência
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback legado
        const temp = document.createElement('textarea');
        temp.value = url;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }
      this.exibirMensagem('Link da crítica copiado!', 'success');
    } catch {
      this.exibirMensagem('Não foi possível compartilhar. Link: ' + url, 'warning');
    }
  }
}

