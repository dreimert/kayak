import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Apollo, gql } from "apollo-angular";

import { Activity } from "./activity.model";
import { Agenda } from "./agenda.model";
import { ID } from "../../types";
import { User } from "./user.model";
import { Article } from "./article.model";

export type ClubId = ID

export class Club {
  public static apollo: Apollo

  public id: ClubId
  public name: string
  public members: User[]
  public activities: Activity[]
  public articles: Article[]
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
                status
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
            status
            start
            end
            participations {
              participant {
                id
                name
                paddles {
                  activityType
                  color
                }
              }
              type
              lastUpdate
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

  getArticles (fetchPolicy: 'network-only' | 'cache-first' = 'cache-first') {
    return Club.apollo.query<{club: Club}>({
      query: gql`
        query Articles($clubId: ID!) {
          club(id: $clubId) {
            articles {
              id
              title
            }
          }
        }
      `,
      variables: {
        clubId: this.id
      },
      fetchPolicy
    }).pipe(
      map(result => result.data.club.articles),
      map(articles => articles.map(article => new Article(article))),
    )
  }

  getArticle (id: string, fetchPolicy: 'network-only' | 'cache-first' = 'cache-first') {
    return Club.apollo.query<{article: Article}>({
      query: gql`
        query Article($articleId: ID!) {
          article(id: $articleId) {
            id
            title
            content
            createdAt
            updatedAt
            iCanEdit
          }
        }
      `,
      variables: {
        articleId: id
      },
      fetchPolicy
    }).pipe(
      map(result => result.data.article),
      map(article => new Article(article)),
    )
  }
}
