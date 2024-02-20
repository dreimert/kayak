import { Model } from "./Model.js";

import { ID } from "../types-db.js";
import { ActivityType } from "../enums/ActivityType.js";
import { Club } from "./Club.js";

export enum Day {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

export type RecurrencePattern = {
  day: Day,
  hour: number,
  minutes: number
}

// https://stackoverflow.com/questions/47893110/typescript-mapped-types-class-to-interface-without-methods
// export type Recurrence = Omit<Activity, 'date' | 'participations' | 'getParticipations' | 'recurring'> & {
//   start: Date
//   end?: Date
//   pattern: RecurrencePattern
// }

export class Recurrence extends Model {
  title: string;
  description: string;
  type: ActivityType;
  start: Date;
  end?: Date;
  pattern: RecurrencePattern;
  coordinator: ID | undefined;

  constructor(data: Partial<Recurrence>, private club: Club) {
    super(data.id, club.recurrences);

    this.title = data.title;
    this.description = data.description;
    this.type = data.type;
    this.start = data.start ? new Date(data.start) : new Date();
    this.end = data.end ? new Date(data.end) : undefined;
    this.pattern = data.pattern;
    this.coordinator = data.coordinator;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      type: this.type,
      start: this.start,
      end: this.end,
      pattern: this.pattern,
      coordinator: this.coordinator
    }
  }
}