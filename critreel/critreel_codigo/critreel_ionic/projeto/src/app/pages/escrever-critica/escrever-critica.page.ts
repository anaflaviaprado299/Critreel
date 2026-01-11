import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { Arquivo } from 'src/app/model/arquivo';
import { Critica } from 'src/app/model/critica';
import { Filme } from 'src/app/model/filme';
import { ArquivoService } from 'src/app/services/arquivo.service';
import { CriticaService } from 'src/app/services/critica.service';
import { FilmeService } from 'src/app/services/filme.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-escrever-critica',
  templateUrl: './escrever-critica.page.html',
  styleUrls: ['./escrever-critica.page.scss'],
  standalone: false,
})
export class EscreverCriticaPage implements OnInit {
  formGroup: FormGroup;
  critica: Critica;
  arquivo: Arquivo;
  filmesFiltrados: Filme[] = [];
  filmeSelecionado: Filme | null = null;

  constructor(
    private arquivoService: ArquivoService,
    private navController: NavController,
    private usuarioService: UsuarioService,
    private criticaService: CriticaService,
    private filmeService: FilmeService,
    private formBuilder: FormBuilder,
    private toastController: ToastController
  ) {
    this.critica = new Critica();
    this.arquivo = new Arquivo();
    this.formGroup = this.formBuilder.group({
      'filme': ['', Validators.compose([Validators.required])],
      'texto': ['', Validators.compose([Validators.required, Validators.maxLength(300)])],
      'imagem': [null]
    });
  }

  public async selecionarImagem() {
    try {
      // Captura a imagem
      this.arquivo = await this.arquivoService.capturar();
    } catch (erro) {
      console.error('Erro ao capturar a imagem:', erro);
      this.exibirMensagem('Não foi possível capturar a imagem. Tente novamente.', 'danger');
      return; // sai do método 
    }
  }

  ngOnInit() {
  }

  onFilmeInput(event: any) {
    const texto = event.target.value || '';
    this.filmeSelecionado = null;
    
    if (texto.length < 2) {
      this.filmesFiltrados = [];
      return;
    }

    // Busca filmes que contenham o texto digitado
    this.filmeService.buscarTodos().subscribe({
      next: (filmes) => {
        this.filmesFiltrados = filmes
          .filter(f => f.titulo.toLowerCase().includes(texto.toLowerCase()))
          .slice(0, 5);
      },
      error: () => this.filmesFiltrados = []
    });
  }

  selecionarFilme(filme: Filme) {
    this.filmeSelecionado = filme;
    this.formGroup.patchValue({ filme: filme.titulo });
    this.filmesFiltrados = [];
  }

  async publicar() {
    if (this.formGroup.invalid) {
      this.exibirMensagem('Por favor, preencha os campos obrigatórios.', 'danger');
      this.formGroup.markAllAsTouched();
      return;
    }

    const idUsuarioLogado = this.usuarioService.buscarAutenticacao()?.idUsuario;
    if (!idUsuarioLogado) {
      this.exibirMensagem('Você precisa estar logado para publicar uma crítica.', 'danger');
      return;
    }

    let urlFoto = '';
    if (this.arquivo && this.arquivo.imagem) {
      try {
        urlFoto = await this.arquivoService.upload(this.arquivo);
      } catch (err) {
        console.error('Publicando sem foto:', err);
      }
    }


    // Se selecionou da lista, salva o idFilme; senão, idFilme fica null
    this.critica = {
      idCritica: 0,
      tituloFilme: this.formGroup.value.filme,
      texto: this.formGroup.value.texto,
      idUsuario: idUsuarioLogado,
      idFilme: this.filmeSelecionado?.idFilme || null,
      dataCriacao: new Date().toISOString().slice(0, 19).replace('T', ' '),
      fotoCritica: urlFoto
    };

    this.criticaService.adicionar(this.critica).subscribe(
      () => {
        this.exibirMensagem('Crítica publicada com sucesso!', 'success');
        this.navController.navigateForward('/minhas-criticas');
      },
      (error) => {
        console.error('Erro ao salvar crítica:', error);
        this.exibirMensagem('Erro ao publicar crítica. Tente novamente.', 'danger');
      }
    );
  }

  async exibirMensagem(texto: string, cor: string) {
    const toast = await this.toastController.create({
      message: texto,
      color: cor,
      duration: 1500
    });
    toast.present()
  }


}
