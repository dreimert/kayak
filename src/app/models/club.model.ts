import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Apollo, gql } from "apollo-angular";

import { Activity } from "./activity.model";
import { Agenda } from "./agenda.model";
import { ID } from "../../types";
import { User } from "./user.model";

export type ClubId = ID

export class Club {
  public static apollo: Apollo

  public id: ClubId
  public name: string
  public members: User[]
  public activities: Activity[]
  public agenda: Agenda

  constructor (data: Partial<Club>) {
    this.id = data.id || ''
    this.name = data.name || ''
    // this.members = (data.members || []).map(member => new User(member))
    // this.activities = (data.activities || []).map(activity => new Activity(activity))
    // this.agenda = new Agenda(data.agenda)
  }

  getAgenda (): Observable<Club['agenda']> {
    return Club.apollo.query<{club: Club}>({
      query: gql`
        query Agenda($clubId: ID!) {
          club(id: $clubId) {
            agenda {
              activities {
                id
                start
                end
                participations {
                  participant {
                    id
                  }
                  type
                }
                type
                recurring
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
        clubId: this.id
      }
    }).pipe(
      map(result => result.data.club.agenda),
      map(agenda => new Agenda(agenda)),
    )
  }

  getActivity (id: string, fetchPolicy: 'network-only' | 'cache-first' = 'cache-first') {
    return Club.apollo.query<{activity: Activity}>({
      query: gql`
        query Activity($activityId: ID!) {
          activity(id: $activityId) {
            id
            title
            description
            start
            end
            participations {
              participant {
                id
                name
              }
              type
            }
            type
            limit
            coordinators
            iCanEdit
          }
        }
      `,
      variables: {
        activityId: id
      },
      fetchPolicy
    }).pipe(
      map(result => result.data.activity),
      map(activity => new Activity(activity)),
    )
  }
}
