import { NgModule } from '@angular/core';

// Módulo legado não utilizado: a página Admin agora é standalone e carregada via loadComponent.
// Mantemos um NgModule vazio apenas para evitar erros de referência cruzada enquanto
// o código legado não é removido totalmente. Este módulo não é importado em lugar nenhum.
@NgModule({})
export class AdminPageModule {}
