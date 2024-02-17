import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';

import { AgendaComponent } from './components/agenda/agenda.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth/auth.guard';
import { authFullOrNotLogGuard } from './guards/authFullOrNotLog/authFullOrNotLog.guard';
import { AboutComponent } from './components/about/about.component';
import { AgendaService } from './services/agenda.service';
import { AuthService } from './services/auth.service';
import { ActivityComponent } from './components/activity/activity.component';

export const routes: Routes = [
  { path: '', redirectTo: '/agenda', pathMatch: 'full' },
  {
    path: 'agenda',
    component: AgendaComponent,
    canActivate: [authFullOrNotLogGuard],
    resolve: {
      'agenda': () => inject(AgendaService).getAgenda(),
      'user': () => inject(AuthService).user$,
    }
  }, {
    path: 'activity/:id',
    component: ActivityComponent,
    canActivate: [authFullOrNotLogGuard],
    resolve: {
      'activity': (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        const agendaService = inject(AgendaService)

        return agendaService.getActivity(route.params['id'])
      },
      'user': () => inject(AuthService).user$,
    }
  },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutComponent },
];
