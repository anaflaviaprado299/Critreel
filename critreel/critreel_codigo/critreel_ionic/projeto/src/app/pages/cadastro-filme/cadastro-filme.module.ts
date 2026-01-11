import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroFilmePageRoutingModule } from './cadastro-filme-routing.module';

import { CadastroFilmePage } from './cadastro-filme.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastroFilmePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CadastroFilmePage]
})
export class CadastroFilmePageModule {}
