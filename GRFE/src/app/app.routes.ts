import { Routes } from '@angular/router';
import { LoginComponent } from './components/layout/login/login.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
//falta terminar o roteamento
//e depois de fazer o roteamento, fazer o routeGuard
export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'navbar', component: NavbarComponent/*, canActivate: [roleGuard]*/}

];
