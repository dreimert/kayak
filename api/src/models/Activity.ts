import { db, getUniqId } from "../datas/db.js";

import { ActivityType } from "../enums/ActivityType.js";

import { ActivityParticipation, ID, Model } from "../types-db.js";

export class Activity implements Model {
  id: ID;
  date: Date;
  type: ActivityType;
  participations: ActivityParticipation[];

  constructor(data: any) {
    this.id = data.id
    this.date = new Date(data.date)
    this.type = data.type
    this.participations = data.participations

    this.id ??= getUniqId(db.activities)
  }

  getParticipations() {
    return this.participations.map((participation) => ({
      participant: db.users.find((member) => member.id === participation.participant),
      type: participation.type
    }))
  }
}