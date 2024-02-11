import { Routes } from '@angular/router';

import { AgendaComponent } from './components/agenda/agenda.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth/auth.guard';
import { authFullOrNotLogGuard } from './guards/authFullOrNotLog/authFullOrNotLog.guard';
import { AboutComponent } from './components/about/about.component';

export const routes: Routes = [
  { path: '', redirectTo: '/agenda', pathMatch: 'full' },
  { path: 'agenda', component: AgendaComponent, canActivate: [authFullOrNotLogGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutComponent },
];
