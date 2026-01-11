import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Filme } from 'src/app/model/filme';
import { FilmeService } from 'src/app/services/filme.service';
import { ImagemFilmeService } from 'src/app/services/imagem-filme.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AvaliacaoFilmeService } from 'src/app/services/avaliacao-filme.service';
import { AvaliacaoFilme } from 'src/app/model/avaliacao-filme';

@Component({
  selector: 'app-meus-filmes',
  templateUrl: './meus-filmes.page.html',
  styleUrls: ['./meus-filmes.page.scss'],
  standalone: false,
})
export class MeusFilmesPage implements OnInit {

  filmes: Filme[] = [];
  idUsuarioLogado: number;

  mediaPorFilme: { [id: number]: number } = {};
  totalPorFilme: { [id: number]: number } = {};

  constructor(private imagemFilmeService: ImagemFilmeService, private router: Router, private filmeService: FilmeService, private usuarioService: UsuarioService, private alertController: AlertController, private avaliacaoFilmeService: AvaliacaoFilmeService) {
    this.idUsuarioLogado = usuarioService.buscarAutenticacao().idUsuario;
  }

  ionViewWillEnter() {
    this.idUsuarioLogado = this.usuarioService.buscarAutenticacao().idUsuario;

    this.carregarFilmesDoUsuario(this.idUsuarioLogado);
  }

  ngOnInit() {
    this.idUsuarioLogado = this.usuarioService.buscarAutenticacao().idUsuario;

    this.carregarFilmesDoUsuario(this.idUsuarioLogado);
  }

  getPoster(filme: any): string {
    return filme.urlPoster || 'assets/images/no-poster.jpg';
  }

  carregarFilmesDoUsuario(idUsuario: number) {
    this.filmeService.buscarPorUsuario(idUsuario).subscribe(
      (filmes) => {
        this.filmes = filmes;

        // Para cada filme, busca o poster correspondente
        this.filmes.forEach(filme => {
          this.imagemFilmeService.buscarPorIdFilme(filme.idFilme).subscribe(
            (imagens) => {
              // Supondo que o backend retorne um array de imagens
              const poster = imagens.find(img => img.tipo === 'POSTER');
              if (poster) {
                (filme as any).urlPoster = poster.caminho; // adiciona dinamicamente a propriedade
              }
            },
            (error) => {
              console.error(`Erro ao carregar poster do filme ${filme.idFilme}:`, error);
            }
          );

          // Carrega média de avaliação do filme
          this.avaliacaoFilmeService.listarPorFilme(filme.idFilme).subscribe({
            next: (lista: AvaliacaoFilme[]) => {
              if (lista.length === 0) {
                this.mediaPorFilme[filme.idFilme] = 0;
                this.totalPorFilme[filme.idFilme] = 0;
                return;
              }
              const soma = lista.reduce((acc: number, av: AvaliacaoFilme) => acc + (av.nota || 0), 0);
              this.mediaPorFilme[filme.idFilme] = soma / lista.length;
              this.totalPorFilme[filme.idFilme] = lista.length;
            },
            error: () => {
              this.mediaPorFilme[filme.idFilme] = 0;
              this.totalPorFilme[filme.idFilme] = 0;
            }
          });
        });
      },
      (error) => {
        console.error('Erro ao carregar filmes:', error);
      }
    );
  }

  async deletarFilme(idFilme: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: 'Tem certeza de que deseja apagar este filme? Esta ação não pode ser desfeita.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Exclusão cancelada');
          },
        },
        {
          text: 'Apagar',
          handler: () => {
            // Se o usuário confirmar, chame o serviço para deletar
            this.filmeService.excluir(idFilme).subscribe(
              () => {
                console.log('Filme deletado com sucesso!');
                // Recarregue a lista de filmes para atualizar a interface
                this.idUsuarioLogado = this.usuarioService.buscarAutenticacao().idUsuario;
                this.carregarFilmesDoUsuario(this.idUsuarioLogado);
              },
              (error) => {
                console.error('Erro ao deletar filme:', error);
              }
            );
          },
        },
      ],
    });

    await alert.present();
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/no-poster.jpg';
  }

  abrirFilme(idFilme: number) {
    this.router.navigate(['/filme', idFilme]);
  }

}
