import mongoose, { HydratedDocument, InferSchemaType, Types } from "mongoose";

import { recurrenceSchema } from "./Recurrence.js";
import { TUser, User } from "./User.js";
import { Activity, TActivity } from "./Activity.js";

export const NumberOfWeeksAnticipation = 6;

type Agenda = {
  activities: HydratedDocument<TActivity>[],
  participants: HydratedDocument<TUser>[]
}

export interface IClubMethods {
  getMembers (): Promise<HydratedDocument<TUser>[]>
  getAdministrators (): Promise<HydratedDocument<TUser>[]>
  getActivities (): Promise<HydratedDocument<TActivity>[]>
  isAdministrateur (user: HydratedDocument<TUser>): boolean
  getAgenda (): Promise<Agenda>
  getUpcomingRecurringActivities (now?: Date): Promise<HydratedDocument<TActivity>[]>
  createRecurrentActivity (): Promise<HydratedDocument<TActivity>[]>
}

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  domains: {
    type: [{
      type: String,
      required: true,
    }],
    required: true,
  },
  members: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    default: [],
  },
  administrators: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    default: [],
  },
  activities: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
    }],
    default: [],
  },
  recurrences: {
    type: [recurrenceSchema],
    default: [],
  },
}, {
  timestamps: true,
  methods: {
    getMembers () {
      if (!this.populated('members')) {
        this.populate('members');
      }
      return this.members;
    },

    getAdministrators () {
      if (!this.populated('administrators')) {
        this.populate('administrators');
      }
      return this.administrators;
    },

    getActivities () {
      if (!this.populated('activities')) {
        this.populate('activities');
      }
      return this.activities;
    },

    getRecurrences () {
      return this.recurrences;
    },

    isAdministrateur (user: HydratedDocument<TUser>): boolean {
      return this.administrators.includes(user.id);
    },
    async getAgenda () {
      const self = await this.populate<{ activities: TActivity[] }>('activities')

      const agendaActivities = self.activities
        .filter((activity) => activity.start.getTime() > Date.now());

      return {
        activities: agendaActivities,
        participants: await Promise.all([...(agendaActivities
          .reduce((set, activity) => {
            activity!.participations.forEach((participation) => {
              set.add(participation.participant.toString());
            });

            return set;
          }, new Set<string>()))]
          .map((id) => User.findById(id))
        )
      };
    },
    async getUpcomingRecurringActivities (now: Date = new Date()): Promise<HydratedDocument<TActivity>[]> {
      return this.recurrences
        .filter((recurrence) => !recurrence.end || recurrence.end.getTime() > now.getTime())
        .map((recurrence) => {
          const nextRecurrence = new Date(now);
          nextRecurrence.setHours(recurrence.pattern.hour);
          nextRecurrence.setMinutes(recurrence.pattern.minutes);
          nextRecurrence.setSeconds(0);
          nextRecurrence.setMilliseconds(0);

          const daysUntilNextRecurrence = (recurrence.pattern.day - nextRecurrence.getDay() + 7) % 7;

          const instance = new Date(nextRecurrence.getTime() + daysUntilNextRecurrence * 24 * 60 * 60 * 1000);

          if (recurrence.start.getTime() < instance.getTime() && (!recurrence.end || instance.getTime() < recurrence.end.getTime())) {
            return new Activity({
              title: recurrence.title,
              description: recurrence.description,
              start: instance,
              end: new Date(instance.getTime() + recurrence.duration),
              type: recurrence.type,
              recurring: true,
              coordinators: [...(recurrence.coordinators || [])],
            });
          } else {
            return
          }
        })
        .filter((instance) => instance !== undefined);
    },
    async createRecurrentActivity () {
      const now = new Date();
      const createdActivities: HydratedDocument<TActivity>[] = [];

      for (let i = 0; i < NumberOfWeeksAnticipation; i++) {
        // @ts-ignore
        const upcomingRecurringActivities: HydratedDocument<TActivity>[] = await this.getUpcomingRecurringActivities(now);

        for (const activity of upcomingRecurringActivities) {
          const findActivity = await Activity.findOne({ start: activity.start, type: activity.type });

          if (!findActivity) {
            activity.save();
            this.activities.push(activity.id);
            createdActivities.push(activity);
          }
        }

        now.setTime(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      }

      await this.save();

      return createdActivities;
    },
  },
});

export type TClub = InferSchemaType<typeof clubSchema>;

export const Club = mongoose.model('Club', clubSchema);