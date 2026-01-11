import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController, NavController } from '@ionic/angular';
import { Filme } from 'src/app/model/filme';
import { ImagemFilme } from 'src/app/model/imagem-filme';
import { FilmeService } from 'src/app/services/filme.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ImagemFilmeService } from 'src/app/services/imagem-filme.service';
import { Arquivo } from 'src/app/model/arquivo';
import { ArquivoService } from 'src/app/services/arquivo.service';

@Component({
  selector: 'app-cadastro-filme',
  templateUrl: './cadastro-filme.page.html',
  styleUrls: ['./cadastro-filme.page.scss'],
  standalone: false,
})
export class CadastroFilmePage {
  formGroup: FormGroup;
  filme: Filme;
  imagemPoster: ImagemFilme;
  arquivo: Arquivo;
  constructor(private arquivoService: ArquivoService, private imagemFilmeService: ImagemFilmeService, private filmeService: FilmeService, private formBuilder: FormBuilder, private toastController: ToastController, private navController: NavController, private usuarioService: UsuarioService) {
    this.filme = new Filme();
    this.arquivo = new Arquivo();
    this.imagemPoster = new ImagemFilme();
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
          // Sem regex: apenas limita o tamanho do texto da URL
          Validators.maxLength(255)
        ])
      ],
      linkAssistir: [
        '',
        Validators.compose([
          // Sem regex: apenas limita o tamanho do texto da URL
          Validators.maxLength(255)
        ])
      ],
    });
  }

  public async selecionarPoster() {
    try {
      // Captura a imagem
      this.arquivo = await this.arquivoService.capturar();
    } catch (erro) {
      console.error('Erro ao capturar a imagem:', erro);
      this.exibirMensagem('Não foi possível capturar a imagem. Tente novamente.', 'danger');
      return; // sai do método 
    }
  }

  // Novo método para lidar com o cadastro do filme
  async salvar() {
    // 1. Verifique se o formulário é válido
    if (this.formGroup.invalid || !this.arquivo || !this.arquivo.imagem) {
      this.exibirMensagem('Por favor, preencha todos os campos obrigatórios e selecione um poster.', 'warning');
      return;
    }

    // 2. Obtenha o ID do usuário logado
    const idUsuarioLogado = this.usuarioService.buscarAutenticacao()?.idUsuario;
    if (!idUsuarioLogado) {
      this.exibirMensagem('Você precisa estar logado para cadastrar um filme.', 'danger');
      return;
    }

    // 3. Crie o objeto Filme com os dados do formulário e o ID do usuário
    const filmeParaCadastro: Filme = {
      ...this.formGroup.value,
      idUsuario: idUsuarioLogado
    };

    // 4. Chame o serviço para enviar os dados para a API
    console.log('Filme para cadastro:', filmeParaCadastro); // Log para depuração
    this.filmeService.cadastrar(filmeParaCadastro).subscribe(
      async(filmeCadastrado) => {
        this.imagemPoster.caminho = await this.arquivoService.upload(this.arquivo);

        this.imagemPoster.idFilme = filmeCadastrado.idFilme; // Assumindo que o ID do filme é retornado e atribuído aqui
        this.imagemPoster.tipo = 'POSTER'; // Definindo o tipo como 'poster'
        this.imagemFilmeService.cadastrar(this.imagemPoster).subscribe(
          () => {
            console.log('Imagem do poster cadastrada com sucesso');
          },
          (error) => {
            console.error('Erro ao cadastrar a imagem do poster:', error);
          }
        );
        this.exibirMensagem('Filme cadastrado com sucesso!', 'success');
        this.navController.navigateForward('/meus-filmes');
      },
      (error) => {
        console.error('Erro ao cadastrar filme:', error);
        this.exibirMensagem('Erro ao cadastrar filme.', 'danger');
      }
    );
  }

  // Método auxiliar para exibir Toasts
  async exibirMensagem(texto: string, cor: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 1500,
      color: cor
    });
    toast.present()
  }

  sair() {
    window.location.href = '/index';
  }
}
