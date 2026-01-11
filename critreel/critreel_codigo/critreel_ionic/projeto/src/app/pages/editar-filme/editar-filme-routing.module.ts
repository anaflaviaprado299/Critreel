import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarFilmePage } from './editar-filme.page';

const routes: Routes = [
  {
    path: '',
    component: EditarFilmePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarFilmePageRoutingModule {}
