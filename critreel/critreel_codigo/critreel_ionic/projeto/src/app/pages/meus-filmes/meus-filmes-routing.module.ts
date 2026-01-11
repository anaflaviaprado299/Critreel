import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeusFilmesPage } from './meus-filmes.page';

const routes: Routes = [
  {
    path: '',
    component: MeusFilmesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeusFilmesPageRoutingModule {}
