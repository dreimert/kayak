import { Injectable } from '@angular/core';

import { Apollo, gql } from 'apollo-angular';

import { map, tap, shareReplay } from 'rxjs/operators';

import { ActivityParticipation, Club } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  constructor (private apollo: Apollo) { }

  getAgenda () {
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
      map(agenda => ({
        ...agenda,
        activities: agenda.activities.map(activity => ({
          ...activity,
          date: new Date(activity.date)
        }))
      })),
      shareReplay(1),
    )
  }

  participate (activityId: string, userId: string, type: string) {
    return this.apollo.mutate<{participate: ActivityParticipation}>({
      mutation: gql`
        mutation Participate($activityId: ID!, $userId: ID!, $type: ParticipationType!) {
          participate(activityId: $activityId, userId: $userId, type: $type) {
            participant {
              id
            }
            type
          }
        }
      `,
      variables: {
        activityId,
        userId,
        type
      }
    }).pipe(
      map(result => result?.data?.participate),
      tap(console.log)
    )
  }
}
