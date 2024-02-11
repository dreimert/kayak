import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

import { Observable, map, shareReplay } from 'rxjs';

export type LoginResponse = {
  success: boolean;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor (
    private apollo: Apollo,
  ) {}

  phone (userId: string) : Observable<string> {
    return this.apollo.query<{phone: string}>({
      query: gql`
        query ShowPhone($userId: ID!) {
          phone(userId: $userId)
        }
      `,
      variables: {
        userId
      }
    }).pipe(
      map(result => result.data.phone),
      shareReplay(1)
    )
  }
}
