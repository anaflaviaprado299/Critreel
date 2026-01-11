import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CriticasharePage } from './criticashare.page';

const routes: Routes = [
  {
    path: '',
    component: CriticasharePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CriticasharePageRoutingModule {}
