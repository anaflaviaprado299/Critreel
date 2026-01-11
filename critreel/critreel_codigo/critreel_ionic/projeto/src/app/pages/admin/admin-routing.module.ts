import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// Módulo de rotas legado não utilizado. A página Admin é standalone e carregada via loadComponent.
// Mantemos o módulo exportando um RouterModule vazio para não quebrar imports antigos.
@NgModule({
  imports: [RouterModule.forChild([])],
  exports: [RouterModule]
})
export class AdminPageRoutingModule {}
