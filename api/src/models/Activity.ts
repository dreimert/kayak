import { db } from "../datas/db.js";

import { Model } from "./Model.js";

import { ActivityType } from "../enums/ActivityType.js";
import { ActivityParticipation, ID } from "../types-db.js";
import { ParticipationType } from "../enums/ParticipationType.js";
import { User } from "./User.js";

export class Activity extends Model {
  title: string;
  description: string;
  start: Date;
  end: Date;
  type: ActivityType;
  recurring: boolean;
  participations: ActivityParticipation[];
  coordinators: ID[];
  // state: 'draft' | 'published' | 'cancel' | 'archived';
  limit: number;
  waitingList: ID[];

  constructor(data: Partial<Activity>) {
    super(data.id, db.activities)

    this.title = data.title
    this.description = data.description
    // @ts-ignore
    this.start = new Date(data.start || data.date)
    this.end = new Date(data.end || this.start)
    this.type = data.type
    this.recurring = data.recurring || false
    this.participations = data.participations || []
    this.coordinators = data.coordinators || []
    // this.state = data.state || 'draft'
    this.limit = data.limit
    this.waitingList = data.waitingList || []
  }

  getParticipations() {
    return this.participations.map((participation) => ({
      participant: User.findById(participation.participant),
      type: participation.type
    }))
  }

  static create(data: any, coordinators: ID[] = []) {
    const activity = new Activity(data)

    activity.coordinators = coordinators
    activity.participations = coordinators.map(coordinator => ({ participant: coordinator, type: ParticipationType.coordinator }))

    db.activities.push(activity)

    return activity
  }

  static findById(id: ID) {
    return db.activities.find((activity) => activity.id === id)
  }
}