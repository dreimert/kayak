import { db } from "../datas/db.js";

import { Model } from "./Model.js";

import { ActivityType } from "../enums/ActivityType.js";
import { ActivityParticipation, ID } from "../types-db.js";
import { ParticipationType } from "../enums/ParticipationType.js";
import { User } from "./User.js";

export class Activity extends Model {
  title: string;
  description: string;
  date: Date;
  type: ActivityType;
  recurring: boolean;
  participations: ActivityParticipation[];
  coordinator: ID | undefined;
  // state: 'draft' | 'published' | 'archived';

  constructor(data: Partial<Activity>) {
    super(data.id, db.activities)

    this.title = data.title
    this.description = data.description
    this.date = new Date(data.date)
    this.type = data.type
    this.recurring = data.recurring || false
    this.participations = data.participations
    this.coordinator = data.coordinator
  }

  getParticipations() {
    return this.participations.map((participation) => ({
      participant: User.findById(participation.participant),
      type: participation.type
    }))
  }

  static create(data: any, user: ID | undefined) {
    const activity = new Activity(data)

    activity.coordinator = user
    activity.participations.push({ participant: user, type: ParticipationType.coordinator })

    db.activities.push(activity)

    return activity
  }

  static findById(id: ID) {
    return db.activities.find((activity) => activity.id === id)
  }
}