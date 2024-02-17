import { Activity } from "./activity.model";
import { UserPartial } from "./user.model";

export class Agenda {
  activities: Activity[];
  participants: UserPartial[]

  constructor (agenda: Partial<Agenda> = {}) {
    this.activities = (agenda.activities || []).map(activity => new Activity(activity));
    this.participants = agenda.participants || []
  }
}
