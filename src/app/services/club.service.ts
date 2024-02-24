import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Activity } from '../models/activity.model';
import { Club } from '../models/club.model';

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  club$: Observable<Club>

  constructor (
    @Inject(DOCUMENT) private document: Document,
    private apollo: Apollo,
  ) {
    Club.apollo = apollo
    Activity.apollo = apollo

    let domain = document.location.hostname.split('.')[0];

    if (domain === 'kayakons') {
      domain = 'cklom'
    }

    this.club$ = this.apollo.query<{clubByDomain: Club}>({
      query: gql`
        query Club($domain: String!) {
          clubByDomain(domain: $domain) {
            id name
          }
        }
      `,
      variables: {
        domain,
      }
    }).pipe(
      map(result => result?.data?.clubByDomain),
      map(club => new Club(club)),
    )
  }

  getClub () {
    return this.club$
  }
}
