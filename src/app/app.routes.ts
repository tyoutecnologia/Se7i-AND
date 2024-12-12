import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { CriarVistoriaComponent } from './criar-vistoria/criar-vistoria.component';
import { CadastroFuncionarioComponent } from './cadastro-funcionario/cadastro-funcionario.component';

export const routes: Routes = [
  // Rota de Login
  { path: 'login', component: LoginComponent },

  // Rotas protegidas com Layout
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'criar-vistoria', component: CriarVistoriaComponent }, // Nova rota
      { path: 'cadastro-funcionario', component: CadastroFuncionarioComponent }
    ],
  },

  // Rota padrão
  { path: '**', redirectTo: 'login' },
];
