import { db } from "../datas/db.js";

import { ActivityType } from "../enums/ActivityType.js";

import { ActivityParticipation, ID } from "../types-db.js";

export class Activity {
  id: ID;
  date: Date;
  type: ActivityType;
  participations: ActivityParticipation[];

  constructor(data: any) {
    this.id = data.id
    this.date = new Date(data.date)
    this.type = data.type
    this.participations = data.participations
  }

  getParticipations() {
    return this.participations.map((participation) => ({
      participant: db.users.find((member) => member.id === participation.participant),
      type: participation.type
    }))
  }
}