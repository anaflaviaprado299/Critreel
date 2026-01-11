import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { Arquivo } from 'src/app/model/arquivo';
import { Filme } from 'src/app/model/filme';
import { ImagemFilme } from 'src/app/model/imagem-filme';
import { ArquivoService } from 'src/app/services/arquivo.service';
import { FilmeService } from 'src/app/services/filme.service';
import { ImagemFilmeService } from 'src/app/services/imagem-filme.service';

@Component({
  selector: 'app-editar-filme',
  templateUrl: './editar-filme.page.html',
  styleUrls: ['./editar-filme.page.scss'],
  standalone: false,
})
export class EditarFilmePage implements OnInit {
  formGroup: FormGroup;
  filme: Filme;
  idFilme: number;
  arquivo: Arquivo;
  imagemPoster: ImagemFilme | null = null;

  constructor(
    private filmeService: FilmeService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private toastController: ToastController,
    private arquivoService: ArquivoService,
    private imagemFilmeService: ImagemFilmeService
  ) {
    this.filme = new Filme();
    this.idFilme = 0;
    this.arquivo = new Arquivo();
    // Inicializa o form group com validadores
    this.formGroup = this.formBuilder.group({
      titulo: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100)
        ])
      ],
      sinopse: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000)
        ])
      ],
      anoLancamento: [
        '',
        Validators.required
      ],
      linkTrailer: [
        '',
        Validators.compose([
          Validators.maxLength(255)
        ])
      ],
      linkAssistir: [
        '',
        Validators.compose([
          Validators.maxLength(255)
        ])
      ],
    });
  }

  ngOnInit() {
    // Captura o ID do filme da URL
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('idFilme');
      if (id) {
        this.idFilme = parseInt(id);
        this.buscarFilme(this.idFilme);
      }
    });
  }

  public async selecionarPoster() {
    try {
      // Captura a imagem
      this.arquivo = await this.arquivoService.capturar();
    } catch (erro) {
      console.error('Erro ao capturar a imagem:', erro);
      this.exibirMensagem('Não foi possível capturar a imagem. Tente novamente.', 'danger');
      return;
    }
  }

  // Busca os dados do filme na API e preenche o formulário
  buscarFilme(id: number) {
    this.filmeService.buscarPorId(id).subscribe({
      next: (filme) => {
        this.filme = filme;
        // Usa patchValue para preencher o formulário com os dados do filme
        this.formGroup.patchValue(filme);

        // Busca a imagem do poster
        this.imagemFilmeService.buscarPorIdFilme(id).subscribe({
          next: (imagens) => {
            // Procura pela imagem do tipo POSTER
            const poster = imagens.find(img => img.tipo === 'POSTER');
            if (poster) {
              this.imagemPoster = poster;
              this.arquivo.imagem = poster.caminho;
            }
          },
          error: (error) => {
            console.error('Erro ao buscar imagens do filme:', error);
          }
        });
      },
      error: (error) => {
        console.error('Erro ao buscar o filme:', error);
        this.exibirMensagem('Erro ao carregar os dados do filme.', 'danger');
        this.navController.navigateBack('/meus-filmes');
      }
    });
  }

  // Lógica para salvar as edições
  async salvar() {
    if (this.formGroup.invalid || !this.arquivo.imagem) {
      this.exibirMensagem('Por favor, preencha todos os campos obrigatórios e selecione um poster.', 'warning');
      return;
    }

    const filmeParaAtualizar: Filme = {
      ...this.filme, // Mantém as propriedades originais, como idFilme e idUsuario
      ...this.formGroup.value, // Sobrescreve com os novos valores do formulário
    };

    try {
      // Atualiza o filme
      await this.filmeService.atualizar(filmeParaAtualizar).toPromise();

      // Se uma nova imagem foi selecionada, faz o upload
      if (this.arquivo && this.arquivo.imagem && this.arquivo.imagem !== this.imagemPoster?.caminho) {
        try {
          const urlPoster = await this.arquivoService.upload(this.arquivo);
          
          if (this.imagemPoster) {
            // Atualiza a imagem existente
            this.imagemPoster.caminho = urlPoster;
            await this.imagemFilmeService.atualizar(this.imagemPoster).toPromise();
          } else {
            // Cria uma nova imagem
            const novaImagem: ImagemFilme = {
              idImagemFilme: 0,
              caminho: urlPoster,
              idFilme: this.filme.idFilme,
              tipo: 'POSTER'
            };
            await this.imagemFilmeService.cadastrar(novaImagem).toPromise();
          }
        } catch (err) {
          console.error('Erro ao atualizar imagem do poster:', err);
        }
      }

      this.exibirMensagem('Filme atualizado com sucesso!', 'success');
      this.navController.navigateBack('/meus-filmes');
    } catch (error) {
      console.error('Erro ao atualizar filme:', error);
      this.exibirMensagem('Erro ao atualizar filme.', 'danger');
    }
  }

  // Lógica para cancelar a edição
  cancelar() {
    this.navController.navigateBack('/meus-filmes');
  }

  // Método auxiliar para exibir toasts
  async exibirMensagem(texto: string, cor: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 1500,
      color: cor
    });
    toast.present();
  }
}
