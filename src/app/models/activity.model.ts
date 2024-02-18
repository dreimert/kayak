import { Apollo, gql } from "apollo-angular"
import { map, shareReplay, tap } from "rxjs/operators"

import { ActivityParticipation, ActivityType, ActivityTypeToLabel, ID, ParticipationType } from "../../types"

export type ActivityId = ID

export class Activity {
  public static apollo: Apollo

  public id: ActivityId
  public title: string
  public description: string
  public type: ActivityType
  public date: Date
  public recurring: boolean
  public participations: ActivityParticipation[]

  constructor (data: Partial<Activity>) {
    this.id = data.id || ''
    this.title = data.title || ''
    this.description = data.description || ''
    this.type = data.type || ActivityType.Kmer
    this.date = data.date ? new Date(data.date) : new Date()
    this.recurring = data.recurring || false
    this.participations = [...(data.participations || [])]
  }

  getParticipationSum () {
    const sums = this.participations.reduce((sums, participation) => {
      sums[participation.type]++

      return sums
    }, { oui: 0, peutEtre: 0, non: 0, nonRepondu: 0, coordinator: 0, security: 0 })

    return {
      ...sums,
      ouiLike: sums.oui + sums.coordinator + sums.security,
    }
  }

  participate (userId: string, type: ParticipationType) {
    return Activity.apollo.mutate<{participate: ActivityParticipation}>({
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
        activityId: this.id,
        userId,
        type
      }
    }).pipe(
      map(result => result?.data?.participate),
      tap(participate => {
        console.log('tap participate', participate);

        const participationIndex = this.participations.findIndex((p) => p.participant.id === userId)

        if (participationIndex !== -1) {
          this.participations[participationIndex] = participate!
        } else {
          this.participations.push({
            participant: participate!.participant,
            type: participate!.type
          })
        }
      }),
    )
  }

  activityTypeLabel () {
    return ActivityTypeToLabel(this.type)
  }
}
