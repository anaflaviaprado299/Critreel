import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscreverCriticaPageRoutingModule } from './escrever-critica-routing.module';

import { EscreverCriticaPage } from './escrever-critica.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscreverCriticaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EscreverCriticaPage]
})
export class EscreverCriticaPageModule {}
