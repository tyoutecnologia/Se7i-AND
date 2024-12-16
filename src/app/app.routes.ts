import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { CriarVistoriaComponent } from './criar-vistoria/criar-vistoria.component';
import { CadastroFuncionarioComponent } from './cadastro-funcionario/cadastro-funcionario.component';
import { CriarServicoFormComponent } from './criar-servico-form/criar-servico-form.component';
import { CadastroCiretranComponent } from './cadastro-ciretran/cadastro-ciretran.component';
import { CadastroDetranComponent } from './cadastro-detran/cadastro-detran.component';
import { CadastroPstvistoriaComponent } from './cadastro-pstvistoria/cadastro-pstvistoria.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'criar-vistoria', component: CriarVistoriaComponent },
      { path: 'cadastro-usuario', component: CadastroFuncionarioComponent },
      { path: 'cadastro-servico', component: CriarServicoFormComponent },
      { path: 'cadastro-ciretran', component: CadastroCiretranComponent },
      { path: 'cadastro-detran', component: CadastroDetranComponent },
      { path: 'cadastro-pstvistoria', component: CadastroPstvistoriaComponent },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
