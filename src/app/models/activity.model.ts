import { Apollo, gql } from "apollo-angular"
import { map, shareReplay } from "rxjs/operators"

import { ActivityParticipation, ActivityType, ID } from "../../types"

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
    this.participations = data.participations || []
  }
}
