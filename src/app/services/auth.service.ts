import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo, gql } from 'apollo-angular';
import { isPlatformBrowser } from '@angular/common';

import { Observable, catchError, firstValueFrom, map, of, shareReplay } from 'rxjs';

import { environment } from '../../environments/environment';

import { User } from '../models/user.model';

export type LoginResponse = {
  success: boolean;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$

  constructor (
    @Inject(PLATFORM_ID) private platformId:Object,
    private http: HttpClient,
    private apollo: Apollo,
  ) {
    if (isPlatformBrowser(platformId)) {
      this.user$ = this.checkAuthenticated()
    } else {
      this.user$ = of(null)
    }
  }

  checkAuthenticated () : Observable<User | null> {
    return this.apollo.query<{me: User}>({
      query: gql`
        query Me {
          me {
            id
            name
            email
            phone
            clubs {
              id
              name
            }
            notifications
            paddles {
              activityType
              color
            }
          }
        }
      `,
      fetchPolicy: 'network-only'
    }).pipe(
      map(result => {
        return result.data.me ? new User(result.data.me) : null
      }),
      catchError(() => of(null)),
      shareReplay(1)
    )
  }

  reCheckAuthenticated () {
    this.user$ = this.checkAuthenticated()
  }

  isAuthenticated () {
    return firstValueFrom(this.user$).then(user => !!user)
  }

  isFullAuthenticated () {
    return firstValueFrom(this.user$).then(user => !!user && !!user.name && !!user.phone)
  }

  login (mail: string) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/magiclogin`, { destination: mail })
  }

  async logout () {
    await firstValueFrom(this.http.get(`${environment.apiUrl}/auth/logout`))

    this.user$ = of(null)
  }
}
