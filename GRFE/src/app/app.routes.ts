import { Routes } from '@angular/router';
import { LoginComponent } from './components/layout/login/login.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { DashGeralComponent } from './components/layout/dash-geral/dash-geral.component';
import { UserListComponent } from './components/layout/admin/user-list/user-list.component';
import { ChamadosListComponent } from './components/layout/chamados/chamados-list/chamados-list.component';
import { ChamadoViewComponent } from './components/layout/chamado/chamado-view/chamado-view.component';
import { ChamadoDetailComponent } from './components/layout/chamado/chamado-detail/chamado-detail.component';
import { RelatoriosComponent } from './components/layout/relatorios/relatorios/relatorios.component';
import { RelatoriosChartsComponent } from './components/layout/relatorios/relatorios-charts/relatorios-charts.component';
//falta terminar o roteamento
//e depois de fazer o roteamento, fazer o routeGuard
export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'navbar', component: NavbarComponent/*, canActivate: [roleGuard]*/, children: [
      {path: 'dashboard', component: DashGeralComponent},
      {path: 'users', component: UserListComponent},
      {path: 'chamados', component: ChamadoViewComponent, children: [
        {path: '', component: ChamadosListComponent},
        {path: 'novo', component: ChamadoDetailComponent},
        {path: ':id', component: ChamadoDetailComponent}
      ]},
      {path: 'relatorios', component: RelatoriosComponent, children: [
        {path: '', component: RelatoriosChartsComponent}
      ]}
    ]
  }
];
