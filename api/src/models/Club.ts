import { db, getUniqId } from "../datas/db.js";

import { ID, Model } from "../types-db.js";

export class Club implements Model {
  id: ID;
  name: string;
  members: ID[];
  activities: ID[];

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.members = data.members;
    this.activities = data.activities;

    this.id ??= getUniqId(db.activities)
  }

  getMembers() {
    return this.members.map((member) => db.users.find((user) => user.id === member))
  }

  getActivities() {
    return this.activities.map((activity) => db.activities.find((act) => act.id === activity)).filter((activity) => activity !== undefined);
  }

  getAgenda() {
    const agendaActivities = this.getActivities()
      .filter((activity) => activity?.date! > new Date());

    return {
      activities: agendaActivities,
      participants: () => [...(agendaActivities
        .reduce((set, activity) => {
          activity!.participations.forEach((participation) => {
            set.add(participation.participant);
          });

          return set;
        }, new Set()))]
        .map((id) => db.users.find((user) => user.id === id))
    };
  }
}