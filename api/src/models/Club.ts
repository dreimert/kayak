import { db } from "../datas/db.js";

import { Model } from "./Model.js";
import { Activity } from "./Activity.js";

import { ID } from "../types-db.js";
import { User } from "./User.js";

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
export type Recurrence = Omit<Activity, 'date' | 'participations' | 'getParticipations' | 'recurring'> & {
  start: Date
  end?: Date
  pattern: RecurrencePattern
}

export class Club extends Model {
  name: string;
  domain: string;
  members: ID[];
  administrateurs: ID[];
  activities: ID[];
  recurrences: Recurrence[];

  constructor(data: Partial<Club>) {
    super(data.id, db.clubs);

    this.name = data.name;
    this.domain = data.domain;
    this.members = data.members || [];
    this.activities = data.activities || [];
    this.recurrences = data.recurrences || [];
  }

  getMembers() {
    return this.members.map((member) => User.findById(member));
  }

  getActivities() {
    return this.activities.map((activity) => Activity.findById(activity)).filter((activity) => activity !== undefined);
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
        }, new Set<ID>()))]
        .map((id) => User.findById(id))
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
            title: recurrence.title,
            description: recurrence.description,
            date: instance,
            type: recurrence.type,
            // club: this.id,
            recurring: true,
            participations: []
          });
        } else {
          return
        }
      })
      .filter((instance) => instance !== undefined);
  }

  // createActivity (date: Date, type: ActivityType) {
  //   const activity = Activity.create({
  //     date,
  //     type,
  //     club: this.id,
  //     participations: []
  //   });

  //   // db.activities.push(activity);


  //   this.activities.push(activity.id);

  //   return activity;
  // }

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

  static create(name: string, domain: string) {
    const club = new Club({
      name,
      domain,
    });

    db.clubs.push(club);

    return club;
  }

  static findById(id: ID) {
    return db.clubs.find((club) => club.id === id);
  }

  static findByDomain(domain: string) {
    return db.clubs.find((club) => club.domain === domain);
  }

  static all() {
    return db.clubs;
  }
}