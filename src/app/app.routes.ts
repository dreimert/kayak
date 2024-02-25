import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';

import { AgendaComponent } from './components/agenda/agenda.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth/auth.guard';
import { authFullOrNotLogGuard } from './guards/authFullOrNotLog/authFullOrNotLog.guard';
import { AboutComponent } from './components/about/about.component';
import { AuthService } from './services/auth.service';
import { ActivityComponent } from './components/activity/activity.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ClubService } from './services/club.service';
import { Club } from './models/club.model';
import { CreateActivityComponent } from './components/create-activity/create-activity.component';

export const routes: Routes = [
  { path: '', redirectTo: '/agenda', pathMatch: 'full' },
  {
    path:'',
    resolve: {
      'club': () => inject(ClubService).getClub(),
    },
    children: [{
      path: 'agenda',
      component: AgendaComponent,
      canActivate: [authFullOrNotLogGuard],
      resolve: {
        'agenda': (route: ActivatedRouteSnapshot) => {
          const club: Club = route.parent!.data['club'];

          return club.getAgenda()
        },
        'user': () => inject(AuthService).user$,
      }
    }, {
      path: 'nouvelle-activite',
      component: CreateActivityComponent,
      canActivate: [authGuard],
    }, {
      path: 'activity/:id',
      component: ActivityComponent,
      canActivate: [authFullOrNotLogGuard],
      resolve: {
        'activity': (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
          const club: Club = route.parent!.data['club'];

          return club.getActivity(route.params['id'])
        },
        'user': () => inject(AuthService).user$,
      }
    }]
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'profile', component: ProfileComponent,
    canActivate: [authGuard],
    resolve: {
      'user': () => inject(AuthService).user$,
    }
  },
  { path: 'about', component: AboutComponent },
  { path: '**', component: PageNotFoundComponent },
];
