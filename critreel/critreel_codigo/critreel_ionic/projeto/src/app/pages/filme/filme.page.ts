import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Favorito } from 'src/app/model/favorito';
import { AvaliacaoFilme } from 'src/app/model/avaliacao-filme';
import { AvaliacaoFilmeService } from 'src/app/services/avaliacao-filme.service';
import { Filme } from 'src/app/model/filme';
import { FavoritoService } from 'src/app/services/favorito.service';
import { FilmeService } from 'src/app/services/filme.service';
import { ImagemFilmeService } from 'src/app/services/imagem-filme.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-filme',
  templateUrl: './filme.page.html',
  styleUrls: ['./filme.page.scss'],
  standalone: false,
})
export class FilmePage implements OnInit {
  idFilme: number;
  filme: Filme;
  trailerUrlSeguro: SafeResourceUrl | null = null;
  posterUrl: string = 'assets/images/no-poster.jpg'; // URL padrão para o poster
  idUsuarioLogado: number;
  isFavorito: boolean;
  avaliacaoUsuario: number = 0; // nota do usuário logado
  mediaAvaliacao: number = 0;   // média das avaliações
  totalAvaliacoes: number = 0;  // quantidade de avaliações
  estrelas: number[] = [1,2,3,4,5];

  constructor(private favoritoService: FavoritoService, private usuarioService: UsuarioService, private imagemFilmeService: ImagemFilmeService, private sanitizer: DomSanitizer, private route: ActivatedRoute, private filmeService: FilmeService, private toastController: ToastController, private avaliacaoFilmeService: AvaliacaoFilmeService) {
    this.filme = new Filme();
    this.idFilme = 0;
    const usuario = usuarioService.buscarAutenticacao();
    this.idUsuarioLogado = usuario?.idUsuario || 0;
    this.isFavorito = false;
  }

  ngOnInit() {
    const usuario = this.usuarioService.buscarAutenticacao();
    this.idUsuarioLogado = usuario?.idUsuario || 0;
    this.idFilme = Number(this.route.snapshot.paramMap.get('idFilme'));

    if (this.idFilme) {
      this.carregarFilme();
      if (this.idUsuarioLogado) {
        this.verificarFavorito(this.idFilme);
        this.carregarAvaliacaoUsuario();
      }
      this.carregarAvaliacoesFilme();
    }
  }

  carregarFilme() {
    this.filmeService.buscarPorId(this.idFilme).subscribe({
      next: (filme) => {
        this.filme = filme;

        if (this.filme.linkTrailer) {
          const videoId = this.extrairVideoId(this.filme.linkTrailer);
          if (videoId) {
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            this.trailerUrlSeguro = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
          }
        }

        // Buscar o poster do filme
        this.carregarPoster(this.idFilme);
        // Recarrega avaliações ao carregar o filme
        this.carregarAvaliacoesFilme();
        this.carregarAvaliacaoUsuario();
      },
      error: () => {
        this.exibirMensagem('Erro ao carregar filme', 'danger');
      }
    });
  }

  carregarPoster(idFilme: number) {
    this.imagemFilmeService.buscarPorIdFilme(idFilme).subscribe(
      (imagens) => {
        // Buscar a imagem do tipo POSTER
        const posterImagem = imagens.find(img => img.tipo === 'POSTER');
        if (posterImagem) {
          this.posterUrl = posterImagem.caminho;
        }
      },
      (error) => {
        console.error('Erro ao carregar poster:', error);
      }
    );
  }

  private extrairVideoId(url: string): string | null {
    try {
      // Caso seja formato encurtado: https://youtu.be/ID
      const regexShort = /youtu\.be\/([a-zA-Z0-9_-]+)/;
      // Caso seja formato normal: https://www.youtube.com/watch?v=ID
      const regexNormal = /v=([a-zA-Z0-9_-]+)/;

      let match = url.match(regexShort);
      if (match && match[1]) {
        return match[1];
      }

      match = url.match(regexNormal);
      if (match && match[1]) {
        return match[1];
      }

      return null;
    } catch {
      return null;
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

  onImageError() {
    this.posterUrl = 'assets/images/no-poster.jpg';
  }


  verificarFavorito(idFilme: number) {
    this.favoritoService.buscarFavoritosPorUsuario(this.idUsuarioLogado).subscribe({
      next: resultado => this.isFavorito = resultado.some(f => f.idFilme === idFilme),
      error: erro => console.error('Erro ao verificar favorito:', erro)
    });
  }

  alternarFavorito(event?: Event) {
    event?.stopPropagation();

    if (!this.idUsuarioLogado) {
      this.exibirMensagem('Faça login para favoritar filmes', 'warning');
      return;
    }

    const favorito = {
      idUsuario: this.idUsuarioLogado,
      idFilme: this.filme.idFilme
    };
    if (this.isFavorito) {
      // desfavoritar: remove da tabela

      this.favoritoService.removerFavorito(favorito).subscribe({
        next: () => this.isFavorito = false,
        error: e => console.error('Erro ao desfavoritar:', e)
      });
    } else {
      // favoritar: adiciona na tabela
      this.favoritoService.adicionarFavorito(favorito).subscribe({
        next: () => this.isFavorito = true,
        error: e => console.error('Erro ao favoritar:', e)
      });
    }
  }

  denunciarFilme(event: Event) {
    // futuramente denunciar filme
  }

  carregarAvaliacoesFilme() {
    if (!this.idFilme) return;
    this.avaliacaoFilmeService.listarPorFilme(this.idFilme).subscribe({
      next: (lista: AvaliacaoFilme[]) => {
        this.totalAvaliacoes = lista.length;
        if (lista.length === 0) {
          this.mediaAvaliacao = 0;
          return;
        }
        const soma = lista.reduce((acc: number, av: AvaliacaoFilme) => acc + (av.nota || 0), 0);
        this.mediaAvaliacao = soma / lista.length;
      },
      error: () => {
        this.mediaAvaliacao = 0;
        this.totalAvaliacoes = 0;
      }
    });
  }

  carregarAvaliacaoUsuario() {
    if (!this.idFilme || !this.idUsuarioLogado) return;
    this.avaliacaoFilmeService.obter(this.idUsuarioLogado, this.idFilme).subscribe({
      next: (av: AvaliacaoFilme) => this.avaliacaoUsuario = av?.nota || 0,
      error: () => this.avaliacaoUsuario = 0 // se não existir avaliação
    });
  }

  setAvaliacao(nota: number) {
    if (!this.idUsuarioLogado || !this.idFilme) {
      this.exibirMensagem('Faça login para avaliar filmes', 'warning');
      return;
    }
    const av = new AvaliacaoFilme();
    av.idUsuario = this.idUsuarioLogado;
    av.idFilme = this.idFilme;
    av.nota = nota;
    this.avaliacaoFilmeService.avaliar(av).subscribe({
      next: () => {
        this.avaliacaoUsuario = nota;
        this.carregarAvaliacoesFilme();
        this.exibirMensagem('Avaliação salva', 'success');
      },
      error: () => this.exibirMensagem('Não foi possível salvar avaliação', 'warning')
    });
  }

  estaAutenticado(): boolean {
    return this.usuarioService.estaAutenticado();
  }

}
