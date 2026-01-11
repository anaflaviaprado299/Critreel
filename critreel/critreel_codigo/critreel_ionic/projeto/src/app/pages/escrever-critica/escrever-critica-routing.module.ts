import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EscreverCriticaPage } from './escrever-critica.page';

const routes: Routes = [
  {
    path: '',
    component: EscreverCriticaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EscreverCriticaPageRoutingModule {}
