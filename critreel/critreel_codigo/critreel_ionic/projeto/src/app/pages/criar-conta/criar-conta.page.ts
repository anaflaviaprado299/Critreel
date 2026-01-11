import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { CadastroService } from 'src/app/services/cadastro.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-criar-conta',
  templateUrl: './criar-conta.page.html',
  styleUrls: ['./criar-conta.page.scss'],
  standalone: false,
})
export class CriarContaPage implements OnInit {

  formGroup: FormGroup;
  usuario: Usuario;
  constructor(private route: ActivatedRoute, private alertController: AlertController, private cadastroService: CadastroService, private formBuilder: FormBuilder, private toastController: ToastController, private navController: NavController, private usuarioService: UsuarioService) {
    this.usuario = new Usuario();
    this.formGroup = this.formBuilder.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.maxLength(100)
        ])
      ],
      nomeCompleto: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(80)
        ])
      ],
      username: [
        '',
        Validators.compose([
          Validators.required,
          // Sem regex: controla apenas tamanho mínimo/máximo do username
          Validators.minLength(3),
          Validators.maxLength(20)
        ])
      ],
      senha: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50)
        ])
      ],
      confirmSenha: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50)
        ])
      ],
    }, { validator: this.senhasIguaisValidator });
  }

  senhasIguaisValidator(form: FormGroup) {
    const senha = form.get('senha')?.value;
    const confirmSenha = form.get('confirmSenha')?.value;
    return senha === confirmSenha ? null : { senhasDiferentes: true };
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['erro'] && params['erro'] === 'dados-perdidos') {
        this.exibirMensagem('Por favor, preencha os dados para criar sua conta.');
      }
    });
  }

  salvar() {
    this.usuario.username = this.formGroup.value.username;
    this.usuario.email = this.formGroup.value.email;

    if (this.formGroup.hasError('senhasDiferentes')) {
      this.exibirMensagem('As senhas não conferem.');
      return; // Corrigido: interrompe o fluxo se as senhas forem diferentes
    }

    this.usuarioService.verificarLogin(this.usuario.username, this.usuario.email).subscribe(resultado => {
      if (resultado) {
        // Se retornar true → login já existe
        this.exibirMensagem('O nome de usuário e/ou o email informado já está em uso.');
      } else {
        // Login disponível → salva o usuário
        const usuarioTemp = {
          email: this.formGroup.value.email,
          nomeCompleto: this.formGroup.value.nomeCompleto,
          username: this.formGroup.value.username,
          senha: this.formGroup.value.senha
        };

        this.cadastroService.salvarInfoIniciais(usuarioTemp).subscribe({
          next: () => {
            this.navController.navigateForward('/gerenciar-perfil');
          },
          error: () => {
            this.exibirMensagem('Erro ao salvar registro!');
          }
        });
      }
    });
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 1500
    });
    toast.present()
  }

}
