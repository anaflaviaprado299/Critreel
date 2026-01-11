import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarCriticaPage } from './editar-critica.page';

const routes: Routes = [
  {
    path: '',
    component: EditarCriticaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarCriticaPageRoutingModule {}
