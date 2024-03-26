import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';

import { authGuard } from './guards/auth/auth.guard';
import { authFullOrNotLogGuard } from './guards/authFullOrNotLog/authFullOrNotLog.guard';
import { AuthService } from './services/auth.service';
import { ClubService } from './services/club.service';
import { Club } from './models/club.model';

export const routes: Routes = [
  { path: '', redirectTo: '/agenda', pathMatch: 'full' },
  {
    path:'',
    resolve: {
      'club': () => inject(ClubService).getClub(),
    },
    children: [{
      path: 'agenda',
      loadComponent: () => import('./components/agenda/agenda.component'),
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
      loadComponent: () => import('./components/create-or-edit-activity/create-or-edit-activity.component'),
      canActivate: [authGuard],
    }, {
      path: 'activity/:id',
      resolve: {
        'activity': (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
          const club: Club = route.parent!.data['club'];

          return club.getActivity(route.params['id'], 'network-only')
        },
        'user': () => inject(AuthService).user$,
      },
      children: [{
        path: '',
        loadComponent: () => import('./components/activity/activity.component'),
        canActivate: [authFullOrNotLogGuard],
      }, {
        path: 'edit',
        loadComponent: () => import('./components/create-or-edit-activity/create-or-edit-activity.component'),
        canActivate: [authGuard],
      }]
    }, {
      path: 'articles',
      loadChildren: () => import('./articles/articles.routes.js'),
      resolve: {
        'user': () => inject(AuthService).user$,
      },
    }]
  }, {
    path: 'login',
    loadComponent: () => import('./components/login/login.component'),
  }, {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component'),
    canActivate: [authGuard],
    resolve: {
      'user': () => inject(AuthService).user$,
    }
  }, {
    path: 'about',
    loadComponent: () => import('./components/about/about.component'),
  }, {
    path: '**',
    loadComponent: () => import('./components/page-not-found/page-not-found.component'),
  },
];
