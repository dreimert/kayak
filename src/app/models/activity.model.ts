import { Apollo, gql } from "apollo-angular"
import { map, tap } from "rxjs/operators"

import { ActivityParticipation, ActivityStatus, ActivityType, ActivityTypeToLabel, ID, ParticipationType } from "../../types"

export type ActivityId = ID

export class Activity {
  public static apollo: Apollo

  public id: ActivityId
  public title: string
  public description: string
  public status: ActivityStatus
  public type: ActivityType
  public start: Date
  public end: Date
  public recurring: boolean
  public participations: ActivityParticipation[]
  public limit: number
  public coordinators: ID[]
  public iCanEdit: boolean

  constructor (data: Partial<Activity>) {
    this.id = data.id || ''
    this.title = data.title || ''
    this.description = data.description || ''
    this.status = data.status || ActivityStatus.published
    this.type = data.type || ActivityType.Kmer
    this.start = data.start ? new Date(data.start) : new Date()
    this.end = data.end ? new Date(data.end) : new Date()
    this.recurring = data.recurring || false
    this.participations = [...(data.participations || [])]
    this.limit = data.limit || 0
    this.coordinators = data.coordinators || []
    this.iCanEdit = data.iCanEdit || false
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
        const participationIndex = this.participations.findIndex((p) => p.participant.id === userId)

        if (participationIndex !== -1) {
          this.participations[participationIndex] = participate!
        } else {
          this.participations.push({
            participant: participate!.participant,
            type: participate!.type,
            lastUpdate: new Date(),
          })
        }
      }),
    )
  }

  activityTypeLabel () {
    return ActivityTypeToLabel(this.type)
  }
}
