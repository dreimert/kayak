import { db } from "../datas/db.js";

import { Model } from "./Model.js";
import { Activity } from "./Activity.js";

import { ActivityType } from "../enums/ActivityType.js";
import { ID } from "../types-db.js";

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

export type Recurrence = {
  start: Date
  end?: Date
  pattern: RecurrencePattern
  type: ActivityType;
}

export class Club extends Model {
  name: string;
  members: ID[];
  activities: ID[];
  recurrences: Recurrence[] = [{
    start: new Date("2024-02-12"),
    end: new Date("2024-03-31"),
    pattern: {
      day: Day.Tuesday,
      hour: 19,
      minutes: 30
    },
    type: ActivityType.musculation,
  }, {
    start: new Date("2024-02-12"),
    pattern: {
      day: Day.Thursday,
      hour: 9,
      minutes: 0
    },
    type: ActivityType.kmer,
  }, {
    start: new Date("2024-02-19"),
    pattern: {
      day: Day.Friday,
      hour: 20,
      minutes: 30
    },
    type: ActivityType.piscine,
  }, {
    start: new Date("2024-02-12"),
    pattern: {
      day: Day.Saturday,
      hour: 9,
      minutes: 0
    },
    type: ActivityType.kmer,
  }, {
    start: new Date("2024-02-12"),
    pattern: {
      day: Day.Saturday,
      hour: 14,
      minutes: 0
    },
    type: ActivityType.kmer,
  }];

  constructor(data: any) {
    super(data.id, db.clubs);

    this.name = data.name;
    this.members = data.members;
    this.activities = data.activities;
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

  getRecurrences() {
    return this.recurrences;
  }

  getUpcomingRecurringActivities (now: Date = new Date()): Activity[] {
    return this.recurrences
      .filter((recurrence) => !recurrence.end || recurrence.end > now)
      .map((recurrence) => {
        const nextRecurrence = new Date(now);
        nextRecurrence.setHours(recurrence.pattern.hour);
        nextRecurrence.setMinutes(recurrence.pattern.minutes);
        nextRecurrence.setSeconds(0);
        nextRecurrence.setMilliseconds(0);

        const daysUntilNextRecurrence = (recurrence.pattern.day - nextRecurrence.getDay() + 7) % 7;

        const instance = new Date(nextRecurrence.getTime() + daysUntilNextRecurrence * 24 * 60 * 60 * 1000);

        if (recurrence.start < instance && (!recurrence.end || instance < recurrence.end)) {
          return new Activity({
            date: instance,
            type: recurrence.type,
            club: this.id,
            participations: []
          });
        } else {
          return
        }
      })
      .filter((instance) => instance !== undefined);
  }

  createActivity (date: Date, type: ActivityType) {
    const activity = new Activity({
      date,
      type,
      club: this.id,
      participations: []
    });

    db.activities.push(activity);

    this.activities.push(activity.id);

    return activity;
  }

  createRecurrentActivity () {
    const now = new Date();
    const createdActivities: Activity[] = [];

    for (let i = 0; i < 8; i++) {
      const upcomingRecurringActivities = this.getUpcomingRecurringActivities(now);

      upcomingRecurringActivities.forEach((activity) => {
        const findActivity = db.activities.find((act) => act.date.getTime() === activity.date.getTime() && act.type === activity.type);

        if (!findActivity) {
          db.activities.push(activity);
          this.activities.push(activity.id);
          createdActivities.push(activity);
        }
      });

      now.setTime(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }

    return createdActivities;
  }
}