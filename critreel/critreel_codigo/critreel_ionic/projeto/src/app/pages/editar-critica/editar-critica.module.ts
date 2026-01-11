import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarCriticaPageRoutingModule } from './editar-critica-routing.module';

import { EditarCriticaPage } from './editar-critica.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditarCriticaPageRoutingModule
  ],
  declarations: [EditarCriticaPage]
})
export class EditarCriticaPageModule {}
