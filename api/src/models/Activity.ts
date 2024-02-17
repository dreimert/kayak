import { db } from "../datas/db.js";

import { Model } from "./Model.js";

import { ActivityType } from "../enums/ActivityType.js";
import { ActivityParticipation, ID } from "../types-db.js";

export class Activity extends Model {
  title: string;
  description: string;
  date: Date;
  type: ActivityType;
  recurring: boolean;
  participations: ActivityParticipation[];
  // state: 'draft' | 'published' | 'archived';

  constructor(data: any) {
    super(data.id, db.activities)

    this.title = data.title
    this.description = data.description
    this.date = new Date(data.date)
    this.type = data.type
    this.recurring = data.recurring || false
    this.participations = data.participations
  }

  getParticipations() {
    return this.participations.map((participation) => ({
      participant: db.users.find((member) => member.id === participation.participant),
      type: participation.type
    }))
  }
}