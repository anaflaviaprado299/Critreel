import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MinhasCriticasPage } from './minhas-criticas.page';

const routes: Routes = [
  {
    path: '',
    component: MinhasCriticasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MinhasCriticasPageRoutingModule {}
