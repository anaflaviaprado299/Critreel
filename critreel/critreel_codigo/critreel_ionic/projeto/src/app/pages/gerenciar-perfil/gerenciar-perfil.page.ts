import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Arquivo } from 'src/app/model/arquivo';
import { ArquivoService } from 'src/app/services/arquivo.service';
import { CadastroService } from 'src/app/services/cadastro.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-gerenciar-perfil',
  templateUrl: './gerenciar-perfil.page.html',
  styleUrls: ['./gerenciar-perfil.page.scss'],
  standalone: false,
})
export class GerenciarPerfilPage implements OnInit {
  private arquivoSelecionado: File | null = null;
  foto: string | null = null;
  biografia: string;
  dtNasc: string;
  arquivo: Arquivo;

  constructor(private toastController: ToastController, private arquivoService: ArquivoService, private cadastroService: CadastroService, private usuarioService: UsuarioService) {
    this.biografia = '';
    this.dtNasc = '';
    this.arquivo = new Arquivo();
  }

  ngOnInit() {
    console.log('Dados armazenados', this.cadastroService['dados']);
  }

  async adicionarFoto() {
    try {
      // Captura a imagem
      this.arquivo = await this.arquivoService.capturar();
    } catch (erro) {
      console.error('Erro ao capturar a imagem:', erro);
      this.exibirMensagem('Não foi possível capturar a imagem. Tente novamente.', 'danger');
      return; // sai do método 
    }
  }

  async continuar() {
    const dadosIniciais = this.cadastroService.getDados();

    const dadosPerfil = {
      bioPerfil: this.biografia,
      dtNasc: this.dtNasc,
    };

    // 3. Junta todos os dados em um só objeto, usando a estrutura de `Usuario`
    const usuarioCompleto = { ...dadosIniciais, ...dadosPerfil };

    if (!this.biografia || !this.dtNasc) {
      this.exibirMensagem('Por favor, preencha todos os campos obrigatórios.', 'warning');
      return;
    }

    if (!this.arquivo || !this.arquivo.imagem) {
      console.log('Nenhuma imagem selecionada.');
      usuarioCompleto.fotoPerfil = "assets/images/imagemperfil.jpg";
      return;
    }else

    usuarioCompleto.fotoPerfil = await this.arquivoService.upload(this.arquivo);

    this.usuarioService.cadastrar(usuarioCompleto).subscribe(
      (response) => {
        console.log('Usuário salvo com sucesso !', response);
        // Lógica de sucesso e navegação
        this.usuarioService.registrarAutenticacao(response);
        // Navegar para a página inicial ou dashboard
        window.location.href = '/tela-principal'; // ou use o Router do Angular
      },
      (error) => {
        console.error('Erro ao salvar o usuário:', error);
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

}
