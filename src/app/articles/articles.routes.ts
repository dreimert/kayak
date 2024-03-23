import { ActivatedRouteSnapshot, Route, RouterStateSnapshot } from "@angular/router";

import { CreateOrEditArticleComponent } from "./create-or-edit-article/create-or-edit-article.component";
import { Club } from "../models/club.model";

import { ArticleComponent } from "./article/article.component";
import { authFullOrNotLogGuard } from "../guards/authFullOrNotLog/authFullOrNotLog.guard";
import { authGuard } from "../guards/auth/auth.guard";
import { ArticlesComponent } from "./articles/articles.component";

export default [{
  path: '',
  component: ArticlesComponent,
  resolve: {
    'articles': (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      const club: Club = route.parent!.data['club'];

      return club.getArticles()
    },
  },
}, {
  path: 'add',
  component: CreateOrEditArticleComponent,
}, {
  path: ':id',
  resolve: {
    'article': (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      const club: Club = route.parent!.data['club'];

      return club.getArticle(route.params['id'], 'network-only')
    },
  },
  children: [{
    path: '',
    component: ArticleComponent,
    canActivate: [authFullOrNotLogGuard],
  }, {
    path: 'edit',
    component: CreateOrEditArticleComponent,
    canActivate: [authGuard],
  }]
}, ] satisfies Route[];