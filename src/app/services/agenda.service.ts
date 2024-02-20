import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Apollo, gql } from 'apollo-angular';

import { map, shareReplay } from 'rxjs/operators';

import { ActivityParticipation } from '../../types';
import { Activity } from '../models/activity.model';
import { Agenda } from '../models/agenda.model';
import { Club } from '../models/club.model';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  constructor (private apollo: Apollo) {
    Activity.apollo = apollo
  }

  getAgenda (): Observable<Club['agenda']> {
    return this.apollo.query<{club: Club}>({
      query: gql`
        query ExampleQuery($clubId: ID!) {
          club(id: $clubId) {
            agenda {
              activities {
                id
                date
                participations {
                  participant {
                    id
                  }
                  type
                }
                type
              }
              participants {
                id
                name
              }
            }
          }
        }
      `,
      variables: {
        clubId: "1"
      }
    }).pipe(
      map(result => result.data.club.agenda),
      map(agenda => new Agenda(agenda)),
      shareReplay(1),
    )
  }

  getActivity (id: string) {
    return this.apollo.query<{activity: Activity}>({
      query: gql`
        query Activity($activityId: ID!) {
          activity(id: $activityId) {
            id
            title
            description
            date
            participations {
              participant {
                id
                name
              }
              type
            }
            type
          }
        }
      `,
      variables: {
        activityId: id
      }
    }).pipe(
      map(result => result.data.activity),
      map(activity => new Activity(activity)),
      shareReplay(1),
    )
  }
}
