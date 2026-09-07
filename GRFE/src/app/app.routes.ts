import { Routes } from '@angular/router';
import { LoginComponent } from './components/layout/login/login.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { DashGeralComponent} from './components/layout/navbar/dash-geral/dash-geral.component';
import { UserListComponent } from './components/layout/navbar/admin/user-list/user-list.component';
import { ChamadosListComponent } from './components/layout/navbar/chamados/chamados-list/chamados-list.component';
import { RelatoriosComponent } from './components/layout/navbar/relatorios/relatorios/relatorios.component';
//falta terminar o roteamento
//e depois de fazer o roteamento, fazer o routeGuard
export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'navbar', component: NavbarComponent/*, canActivate: [roleGuard]*/, children: [
      {path: 'dashboard', component: DashGeralComponent},
      {path: 'users', component: UserListComponent},
      {path: 'chamados', component: ChamadosListComponent},
      {path: 'relatorios', component: RelatoriosComponent}
    ]
  }
];
