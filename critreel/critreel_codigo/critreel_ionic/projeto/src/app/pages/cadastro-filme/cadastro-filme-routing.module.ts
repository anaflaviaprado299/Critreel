import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroFilmePage } from './cadastro-filme.page';

const routes: Routes = [
  {
    path: '',
    component: CadastroFilmePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastroFilmePageRoutingModule {}
