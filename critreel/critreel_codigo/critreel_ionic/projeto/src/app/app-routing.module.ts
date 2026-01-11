import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CadastroGuard } from './guards/cadastro.guard';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full',
  },
  {
    path: 'index',
    loadChildren: () =>
      import('./pages/index/index.module').then((m) => m.IndexPageModule),
  },
  {
    path: 'cadastro-filme',
    loadChildren: () =>
      import('./pages/cadastro-filme/cadastro-filme.module').then((m) => m.CadastroFilmePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'criar-conta',
    loadChildren: () => import('./pages/criar-conta/criar-conta.module').then(m => m.CriarContaPageModule)
  },
  {
    path: 'editar-filme/:idFilme',
    loadChildren: () => import('./pages/editar-filme/editar-filme.module').then(m => m.EditarFilmePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'editar-perfil',
    loadChildren: () => import('./pages/editar-perfil/editar-perfil.module').then(m => m.EditarPerfilPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'editar-critica/:idCritica',
    loadChildren: () => import('./pages/editar-critica/editar-critica.module').then(m => m.EditarCriticaPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'escrever-critica',
    loadChildren: () => import('./pages/escrever-critica/escrever-critica.module').then(m => m.EscreverCriticaPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'filme/:idFilme',
    loadChildren: () => import('./pages/filme/filme.module').then(m => m.FilmePageModule)
  },
  {
    path: 'gerenciar-perfil',
    loadChildren: () => import('./pages/gerenciar-perfil/gerenciar-perfil.module').then(m => m.GerenciarPerfilPageModule),
    canActivate: [CadastroGuard, AuthGuard]
  },
  {
    path: 'meus-filmes',
    loadChildren: () => import('./pages/meus-filmes/meus-filmes.module').then(m => m.MeusFilmesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'minhas-criticas',
    loadChildren: () => import('./pages/minhas-criticas/minhas-criticas.module').then(m => m.MinhasCriticasPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then(m => m.PerfilPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'posts',
    loadChildren: () => import('./pages/posts/posts.module').then(m => m.PostsPageModule)
  },
  {
    path: 'tela-principal',
    loadChildren: () => import('./pages/tela-principal/tela-principal.module').then(m => m.TelaPrincipalPageModule)
  },
  {
    path: 'favoritos',
    loadChildren: () => import('./pages/favoritos/favoritos.module').then(m => m.FavoritosPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'perfil/:idUsuario',
    loadChildren: () => import('./pages/perfil/perfil.module').then(m => m.PerfilPageModule)
  },
  {
    path: 'criticashare/:idCritica',
    loadChildren: () => import('./pages/criticashare/criticashare.module').then( m => m.CriticasharePageModule)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.page').then(m => m.AdminPage),
    canActivate: [AdminGuard]
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
