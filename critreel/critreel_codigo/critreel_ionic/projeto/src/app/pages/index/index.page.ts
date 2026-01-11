import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, ToastController, NavController, LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Usuario } from 'src/app/model/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
  standalone: false,
})
export class IndexPage {
  formGroup: FormGroup;
  usuario: Usuario;
  constructor(private loadingController: LoadingController, private alertController: AlertController, private formBuilder: FormBuilder, private toastController: ToastController, private navController: NavController, private usuarioService: UsuarioService) {
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
      senha: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50)
        ])
      ],
    })
  }

  async autenticar() {
    if (!this.formGroup.valid) {
      const alert = await this.alertController.create({
        header: 'Atenção',
        message: 'Por favor, preencha todos os campos.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Pega os dados do formulário
    const { email, senha } = this.formGroup.value;

    console.log("Dados do formulário:", this.formGroup.value);
    // 2. Exibe um alerta de carregamento
    const loading = await this.loadingController.create({
      message: 'Autenticando...'
    });
    await loading.present();

    try {
      // 3. Chama o método de autenticação do serviço. 
      const usuarioAutenticado = await firstValueFrom(this.usuarioService.autenticar(email, senha));

      // 4. Em caso de sucesso
      await loading.dismiss();
      const toast = await this.toastController.create({
        message: 'Login realizado com sucesso!',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
      this.usuarioService.registrarAutenticacao(usuarioAutenticado);

      // Navega para a tela principal
      this.navController.navigateForward('/tela-principal');

    } catch (error: any) {
      // 5. Em caso de falha
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Email ou senha inválidos. Tente novamente.',
        buttons: ['OK']
      });
      await alert.present();
      console.error('Erro de autenticação:', error);
    }
  }
}
