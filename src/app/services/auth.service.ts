import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo, gql } from 'apollo-angular';
import { isPlatformBrowser } from '@angular/common';

import { Observable, firstValueFrom, map, of, shareReplay } from 'rxjs';

import { UserFull } from '../../types';

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

  checkAuthenticated () : Observable<UserFull | null> {
    return this.apollo.query<{me: UserFull}>({
      query: gql`
        query Me {
          me {
            id
            name
            email
            phone
          }
        }
      `
    }).pipe(
      map(result => {
        return result.data.me || null
      }),
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
    return this.http.post<LoginResponse>('https://kayakons.dev/api/auth/magiclogin', { destination: mail })
  }

  async logout () {
    await firstValueFrom(this.http.get('https://kayakons.dev/api/auth/logout'))

    this.user$ = of(null)
  }
}
