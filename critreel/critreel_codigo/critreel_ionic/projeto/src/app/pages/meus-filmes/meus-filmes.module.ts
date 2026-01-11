import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeusFilmesPageRoutingModule } from './meus-filmes-routing.module';

import { MeusFilmesPage } from './meus-filmes.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeusFilmesPageRoutingModule
  ],
  declarations: [MeusFilmesPage]
})
export class MeusFilmesPageModule {}
