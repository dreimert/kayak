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

  data (userId: string, type: 'phone' | 'email') : Observable<string> {
    return this.apollo.query<{userPrivateData: string}>({
      query: gql`
        query ShowData($userId: ID!, $type: String!) {
          userPrivateData(userId: $userId, type: $type)
        }
      `,
      variables: {
        userId,
        type
      }
    }).pipe(
      map(result => result.data.userPrivateData),
      shareReplay(1)
    )
  }
}
