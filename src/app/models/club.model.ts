import { ID } from "../../types";

import { Activity } from "./activity.model";
import { Agenda } from "./agenda.model";
import { User } from "./user.model";

export type ClubId = ID

export class Club {
  public id: ClubId
  public name: string
  public members: User[]
  public activities: Activity[]
  public agenda: Agenda

  constructor (data: Partial<Club>) {
    this.id = data.id || ''
    this.name = data.name || ''
    this.members = (data.members || []).map(member => new User(member))
    this.activities = (data.activities || []).map(activity => new Activity(activity))
    this.agenda = new Agenda(data.agenda)
  }
}
