import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ToastController, AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FilmeService } from 'src/app/services/filme.service';
import { CriticaService } from 'src/app/services/critica.service';
import { AvaliacaoFilmeService } from 'src/app/services/avaliacao-filme.service';
import { AvaliacaoFilme } from 'src/app/model/avaliacao-filme';
import { Filme } from 'src/app/model/filme';
import { Critica } from 'src/app/model/critica';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AdminPage implements OnInit {
  // KPIs
  totalUsuarios = 0;
  totalFilmes = 0;
  totalCriticas = 0;

  // Rankings
  topFilmes: Array<{ filme: Filme; media: number; total: number }> = [];

  // Listas
  recentesCriticas: Critica[] = [];
  primeirosFilmes: Filme[] = [];
  todosUsuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  buscaUsuario = '';

  // Limites de exibição para evitar renderizar listas gigantes de uma vez
  limiteFilmesVisiveis = 20;
  limiteCriticasVisiveis = 20;

  constructor(
    private usuarioService: UsuarioService,
    private filmeService: FilmeService,
    private criticaService: CriticaService,
    private avaliacaoService: AvaliacaoFilmeService,
    private toast: ToastController,
    private alert: AlertController
  ) {}

  ngOnInit() {
    this.carregarTudo();
  }

  carregarTudo() {

    // Usuários
    this.usuarioService.buscarTodos().subscribe({
      next: lista => {
        this.totalUsuarios = lista.length;
        this.todosUsuarios = lista;
        this.usuariosFiltrados = lista;
      },
      error: () => this.totalUsuarios = 0
    });

    // Filmes e top por média
    this.filmeService.buscarTodos().subscribe({
      next: filmes => {
        this.totalFilmes = filmes.length;
        // exibe todos os filmes para o admin poder gerenciar qualquer um
        this.primeirosFilmes = filmes;
        this.carregarTopFilmes(filmes);
      },
      error: () => this.totalFilmes = 0
    });

    // Críticas e recentes
    this.criticaService.buscarTodas().subscribe({
      next: crits => {
        this.totalCriticas = crits.length;
        // ordena da mais recente para a mais antiga, sem limitar a quantidade
        this.recentesCriticas = [...crits]
          .sort((a, b) => (b.dataCriacao).localeCompare(a.dataCriacao));
      },
      error: () => this.totalCriticas = 0
    });
  }

  private carregarTopFilmes(filmes: Filme[]) {
    const iterador: { filme: Filme; media: number; total: number }[] = [];
    let pendentes = filmes.length;
    if (pendentes === 0) {
      this.topFilmes = [];
      return;
    }
    filmes.forEach(f => {
      this.avaliacaoService.listarPorFilme(f.idFilme).subscribe({
        next: (avaliacao: AvaliacaoFilme[]) => {
          const total = avaliacao.length;
          const media = total > 0 ? avaliacao.reduce((s, a) => s + (a.nota), 0) / total : 0;
          iterador.push({ filme: f, media, total });
        },
        error: () => {
          iterador.push({ filme: f, media: 0, total: 0 });
        },
        complete: () => {
          pendentes--;
          if (pendentes === 0) {
            this.topFilmes = iterador
              .filter(x => x.total > 0)
              .sort((a, b) => b.media - a.media || b.total - a.total) //separa em ordem decrescente pela média, e em caso de empate pela quantidade de avaliações
              .slice(0, 5); //extrai parte do vetor, do item 0 ao 5
          }
        }
      });
    });
  }

  async confirmarExcluirFilme(idFilme: number, titulo: string) {
    const ref = await this.alert.create({
      header: 'Apagar filme',
      message: `Deseja apagar "${titulo}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Apagar', role: 'destructive', handler: () => this.excluirFilme(idFilme) }
      ]
    });
    await ref.present();
  }

  async confirmarExcluirCritica(idCritica: number) {
    const ref = await this.alert.create({
      header: 'Apagar crítica',
      message: 'Deseja apagar esta crítica?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Apagar', role: 'destructive', handler: () => this.excluirCritica(idCritica) }
      ]
    });
    await ref.present();
  }

  private excluirFilme(idFilme: number) {
    this.filmeService.excluir(idFilme).subscribe({
      next: async () => {
        (await this.toast.create({ message: 'Filme apagado', duration: 1200, color: 'success' })).present();
        this.carregarTudo();
      },
      error: async () => (await this.toast.create({ message: 'Falha ao apagar filme', duration: 1400, color: 'danger' })).present()
    });
  }

  private excluirCritica(idCritica: number) {
    this.criticaService.excluir(idCritica).subscribe({
      next: async () => {
        (await this.toast.create({ message: 'Crítica apagada', duration: 1200, color: 'success' })).present();
        this.carregarTudo();
      },
      error: async () => (await this.toast.create({ message: 'Falha ao apagar crítica', duration: 1400, color: 'danger' })).present()
    });
  }

  filtrarUsuarios() {
    const termo = this.buscaUsuario.toLowerCase().trim();
    if (!termo) {
      this.usuariosFiltrados = this.todosUsuarios;
    } else {
      this.usuariosFiltrados = this.todosUsuarios.filter(u => 
        u.username.toLowerCase().includes(termo) || 
        u.email.toLowerCase().includes(termo)
      );
    }
  }

  async alternarAdmin(usuario: Usuario) {
    const usuarioLogado = this.usuarioService.buscarAutenticacao();
    
    // Verifica se é admin ou não
    const eAdmin = usuario.admin;
    
    // Bloqueia remover a si mesmo de admin
    if (usuario.idUsuario === usuarioLogado.idUsuario && eAdmin) {
      (await this.toast.create({
        message: 'Você não pode remover a si mesmo de administrador',
        duration: 2000,
        color: 'warning'
      })).present();
      return;
    }
    
    // Mensagens
    const header = eAdmin ? 'Remover Admin' : 'Promover a Admin';
    const mensagem = eAdmin 
      ? `Remover ${usuario.username} de administrador?`
      : `Promover ${usuario.username} para administrador?`;
    
    // Confirmação
    const alert = await this.alert.create({
      header: header,
      message: mensagem,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Confirmar',
          handler: () => this.salvarStatusAdmin(usuario, !eAdmin)
        }
      ]
    });
    await alert.present();
  }

  private salvarStatusAdmin(usuario: Usuario, novoStatus: boolean) {
    // Modifica o status de admin no objeto
    usuario.admin = novoStatus;
    
    // Atualiza o perfil completo
    this.usuarioService.atualizarPerfil(usuario).subscribe({
      next: async () => {
        const acao = novoStatus ? 'promovido' : 'removido';
        (await this.toast.create({
          message: `${usuario.username} ${acao} com sucesso!`,
          duration: 1500,
          color: 'success'
        })).present();
      },
      error: async () => {
        (await this.toast.create({
          message: 'Erro ao alterar status de admin',
          duration: 1500,
          color: 'danger'
        })).present();
      }
    });
  }

  async confirmarExcluirUsuario(usuario: Usuario) {
    const usuarioLogado = this.usuarioService.buscarAutenticacao();
    
    // Impede que o admin delete a si mesmo
    if (usuario.idUsuario === usuarioLogado.idUsuario) {
      (await this.toast.create({
        message: 'Você não pode deletar sua própria conta',
        duration: 2000,
        color: 'warning'
      })).present();
      return;
    }

    const ref = await this.alert.create({
      header: 'Excluir Usuário',
      message: `Deseja excluir permanentemente o usuário "${usuario.username}"? Esta ação não pode ser desfeita.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Excluir', role: 'destructive', handler: () => this.excluirUsuario(usuario.idUsuario) }
      ]
    });
    await ref.present();
  }

  private excluirUsuario(idUsuario: number) {
    this.usuarioService.excluir(idUsuario).subscribe({
      next: async () => {
        (await this.toast.create({ message: 'Usuário excluído com sucesso', duration: 1200, color: 'success' })).present();
        this.carregarTudo();
      },
      error: async (erro) => {
        console.error('Erro ao excluir usuário:', erro);
        (await this.toast.create({ 
          message: 'Não foi possível excluir: usuário possui vínculos no sistema', 
          duration: 3000, 
          color: 'danger' 
        })).present();
      }
    });
  }

  // Controle de carregamento progressivo nas listas
  carregarMaisFilmes() {
    this.limiteFilmesVisiveis += 20;
  }

  carregarMaisCriticas() {
    this.limiteCriticasVisiveis += 20;
  }
}
