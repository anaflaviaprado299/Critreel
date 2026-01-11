import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Filme } from 'src/app/model/filme';
import { Usuario } from 'src/app/model/usuario';
import { CriticaService } from 'src/app/services/critica.service';
import { FilmeService } from 'src/app/services/filme.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SeguidorService } from 'src/app/services/seguidor.service';
import { Seguidor } from 'src/app/model/seguidor';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {
  usuario: Usuario;
  totalFilmes: number;
  totalCriticas: number;
  proprioPerfil: boolean;
  seguidoresCount: number = 0;
  seguindoCount: number = 0;
  isSeguindo: boolean = false;
  mostrarListaSeguidores: boolean = false;
  listaSeguidores: Usuario[] = [];
  listaSeguindo: Usuario[] = [];
  modalSeguidoresAberto: boolean = false;
  tabConexoes: 'seguidores' | 'seguindo' = 'seguidores';

  constructor(
    private route: ActivatedRoute,
    private criticaService: CriticaService,
    private usuarioService: UsuarioService,
    private filmeService: FilmeService,
    private seguidorService: SeguidorService,
    private router: Router
  ) {
    this.usuario = new Usuario();
    this.totalFilmes = 0;
    this.totalCriticas = 0;
    this.proprioPerfil = true;
  }

  ionViewWillEnter() {
    this.carregarUsuario();
  }

  ngOnInit() {
    this.carregarUsuario();
  }

  carregarUsuario() {
    const idParam = Number(this.route.snapshot.paramMap.get('idUsuario'));
    const usuarioLogado = this.usuarioService.buscarAutenticacao();
    let idParaCarregar;

    // Se não tem parâmetro na URL ou se o parâmetro é igual ao usuário logado
    if (idParam === 0 || (usuarioLogado?.idUsuario && idParam === usuarioLogado.idUsuario)) {
      this.proprioPerfil = true;
      idParaCarregar = usuarioLogado?.idUsuario;
    } else {
      this.proprioPerfil = false;
      idParaCarregar = idParam;
    }

    if (!idParaCarregar) {
      return;
    }

    this.usuarioService.buscarPorId(idParaCarregar).subscribe({
      next: (dados) => {
        this.usuario = dados;
        this.carregarInformacoes(dados.idUsuario);
      },
      error: (err) => {
        console.error('Erro ao carregar usuário:', err);
      }
    });
  }

  carregarInformacoes(idUsuario: number) {
    this.filmeService.buscarPorUsuario(idUsuario).subscribe({
      next: (filmes: Filme[]) => {
        this.totalFilmes = filmes.length;
      },
      error: (err) => {
        console.error('Erro ao buscar filmes do usuário', err);
      },
    });

    this.criticaService.buscarPorUsuario(idUsuario).subscribe({
      next: (criticas: any[]) => {
        this.totalCriticas = criticas.length;
      },
      error: (err) => {
        console.error('Erro ao buscar críticas do usuário', err);
      },
    });
    // Contagens seguidores / seguindo
    this.seguidorService.contarSeguidores(idUsuario).subscribe({
      next: qtd => this.seguidoresCount = qtd,
      error: () => this.seguidoresCount = 0
    });
    this.seguidorService.contarSeguindo(idUsuario).subscribe({
      next: qtd => this.seguindoCount = qtd,
      error: () => this.seguindoCount = 0
    });

    // Verificar se usuário logado segue este perfil (quando não é o próprio)
    const logado = this.usuarioService.buscarAutenticacao();
    if (!this.proprioPerfil && logado?.idUsuario) {
      this.seguidorService.verificar(logado.idUsuario, idUsuario).subscribe({
        next: segue => this.isSeguindo = segue,
        error: () => this.isSeguindo = false
      });
    }
  }

  alternarSeguir() {
    const logado = this.usuarioService.buscarAutenticacao();
    if (!logado?.idUsuario) {
      // Usuário não logado tentando seguir
      return;
    }
    if (this.proprioPerfil || !this.usuario?.idUsuario) return;
  const payload = new Seguidor();
  payload.idSeguidor = logado.idUsuario;
  payload.idSeguido = this.usuario.idUsuario;
    this.seguidorService.alternar(payload).subscribe({
      next: resultado => {
        this.isSeguindo = resultado; // true = passou a seguir; false = deixou de seguir
        // Ajusta contagem local
        if (resultado) {
          this.seguidoresCount += 1;
        } else {
          this.seguidoresCount = Math.max(0, this.seguidoresCount - 1);
        }
      },
      error: err => console.error('Erro ao alternar seguir', err)
    });
  }

  estaAutenticado(): boolean {
    return this.usuarioService.estaAutenticado();
  }

  abrirSeguidoresModal() {
    if (!this.usuario?.idUsuario) return;
    this.modalSeguidoresAberto = true;
    this.tabConexoes = 'seguidores';
    // Carrega seguidores na abertura
    this.seguidorService.listarSeguidores(this.usuario.idUsuario).subscribe({
      next: usuarios => this.listaSeguidores = usuarios,
      error: () => this.listaSeguidores = []
    });
    // Carrega seguindo somente ao abrir (aparece dentro do modal)
    this.seguidorService.listarSeguindo(this.usuario.idUsuario).subscribe({
      next: usuarios => this.listaSeguindo = usuarios,
      error: () => this.listaSeguindo = []
    });
  }

  fecharSeguidoresModal() {
    this.modalSeguidoresAberto = false;
  }

  navegarPerfil(idUsuario: number) {
    if (idUsuario) {
      this.router.navigate(['/perfil', idUsuario]);
    }
  }

  onClickConexao(idUsuario: number) {
    // Fecha o modal antes de navegar para uma transição mais suave
    this.modalSeguidoresAberto = false;
    // Aguarda o fechamento do modal para iniciar a navegação
    setTimeout(() => this.navegarPerfil(idUsuario), 200);
  }

}
