import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { Arquivo } from 'src/app/model/arquivo';
import { Critica } from 'src/app/model/critica';
import { Filme } from 'src/app/model/filme';
import { ArquivoService } from 'src/app/services/arquivo.service';
import { CriticaService } from 'src/app/services/critica.service';
import { FilmeService } from 'src/app/services/filme.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-editar-critica',
  templateUrl: './editar-critica.page.html',
  styleUrls: ['./editar-critica.page.scss'],
  standalone: false,
})
export class EditarCriticaPage implements OnInit {
  formGroup: FormGroup;
  critica: Critica;
  arquivo: Arquivo;
  filmesFiltrados: Filme[] = [];
  filmeSelecionado: Filme | null = null;
  idCritica: number;

  constructor(
    private arquivoService: ArquivoService,
    private navController: NavController,
    private usuarioService: UsuarioService,
    private criticaService: CriticaService,
    private filmeService: FilmeService,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute
  ) {
    this.critica = new Critica();
    this.arquivo = new Arquivo();
    this.idCritica = 0;
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
      return;
    }
  }

  ngOnInit() {
    // Captura o ID da crítica da URL
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('idCritica');
      if (id) {
        this.idCritica = parseInt(id);
        this.buscarCritica(this.idCritica);
      }
    });
  }

  // Busca os dados da crítica na API e preenche o formulário
  buscarCritica(id: number) {
    this.criticaService.buscarPorId(id).subscribe({
      next: (critica) => {
        this.critica = critica;
        
        // Preenche o formulário com os dados da crítica
        this.formGroup.patchValue({
          filme: critica.tituloFilme,
          texto: critica.texto
        });

        // Se houver imagem, carrega a preview
        if (critica.fotoCritica) {
          this.arquivo.imagem = critica.fotoCritica;
        }

        // Se tiver idFilme, busca o filme para ter o objeto completo
        if (critica.idFilme) {
          this.filmeService.buscarPorId(critica.idFilme).subscribe({
            next: (filme) => {
              this.filmeSelecionado = filme;
            },
            error: (error) => console.error('Erro ao buscar filme:', error)
          });
        }
      },
      error: (error) => {
        console.error('Erro ao buscar a crítica:', error);
        this.exibirMensagem('Erro ao carregar os dados da crítica.', 'danger');
        this.navController.navigateBack('/minhas-criticas');
      }
    });
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

  async atualizar() {
    if (this.formGroup.invalid) {
      this.exibirMensagem('Por favor, preencha os campos obrigatórios.', 'danger');
      this.formGroup.markAllAsTouched();
      return;
    }

    const idUsuarioLogado = this.usuarioService.buscarAutenticacao()?.idUsuario;
    if (!idUsuarioLogado) {
      this.exibirMensagem('Você precisa estar logado para editar uma crítica.', 'danger');
      return;
    }

    let urlFoto = this.critica.fotoCritica || '';
    
    // Se uma nova imagem foi selecionada, faz o upload
    if (this.arquivo && this.arquivo.imagem && this.arquivo.imagem !== this.critica.fotoCritica) {
      try {
        urlFoto = await this.arquivoService.upload(this.arquivo);
      } catch (err) {
        console.error('Erro ao fazer upload da imagem:', err);
      }
    }

    // Atualiza a crítica mantendo o ID original
    const criticaAtualizada: Critica = {
      idCritica: this.critica.idCritica,
      tituloFilme: this.formGroup.value.filme,
      texto: this.formGroup.value.texto,
      idUsuario: idUsuarioLogado,
      idFilme: this.filmeSelecionado?.idFilme || this.critica.idFilme || null,
      dataCriacao: this.critica.dataCriacao,
      fotoCritica: urlFoto
    };

    this.criticaService.editar(criticaAtualizada).subscribe(
      () => {
        this.exibirMensagem('Crítica atualizada com sucesso!', 'success');
        this.navController.navigateForward('/minhas-criticas');
      },
      (error) => {
        console.error('Erro ao atualizar crítica:', error);
        this.exibirMensagem('Erro ao atualizar crítica. Tente novamente.', 'danger');
      }
    );
  }

  cancelar() {
    this.navController.navigateBack('/minhas-criticas');
  }

  async exibirMensagem(texto: string, cor: string) {
    const toast = await this.toastController.create({
      message: texto,
      color: cor,
      duration: 1500
    });
    toast.present();
  }
}
