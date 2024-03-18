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
import { CreateOrEditActivityComponent } from './components/create-or-edit-activity/create-or-edit-activity.component';

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
      component: CreateOrEditActivityComponent,
      canActivate: [authGuard],
    }, {
      path: 'activity/:id',
      resolve: {
        'activity': (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
          const club: Club = route.parent!.data['club'];

          console.log('activity resolver', route.params['id']);

          return club.getActivity(route.params['id'], 'network-only')
        },
        'user': () => inject(AuthService).user$,
      },
      children: [{
        path: '',
        component: ActivityComponent,
        canActivate: [authFullOrNotLogGuard],
      }, {
        path: 'edit',
        component: CreateOrEditActivityComponent,
        canActivate: [authGuard],
      }]
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
