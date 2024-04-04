import { HydratedDocument, InferSchemaType, Schema, Types, model } from "mongoose";

import { ActivityType } from "../enums/ActivityType.js";
import { ParticipationType } from "../enums/ParticipationType.js";
import { TUser } from "./User.js";
import { Club } from "./Club.js";

export interface IActivityMethods {
  isCoordinatorOrClubAdministrator (user: HydratedDocument<TUser> | null): Promise<boolean>
}

const activitySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description:  {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ActivityType,
    required: true,
  },
  recurring: {
    type: Boolean,
    default: false,
  },
  participations: {
    type: [{
      participant: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      type: {
        type: String,
        enum: ParticipationType,
        required: true,
      },
      lastUpdate: {
        type: Date,
        required: true,
        default: Date.now,
      },
    }],
    default: [],
  },
  coordinators: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  limit: {
    type: Number,
    required: true,
    default: 0,
  },
  waitingList: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    default: [],
  },
}, {
  timestamps: true,
  methods: {
    async isCoordinatorOrClubAdministrator (user: HydratedDocument<TUser> | null) {
      if (!user) {
        return false;
      } else if (this.coordinators.includes(user.id)) {
        return true;
      } else {
        const clubs = await Club.find({ activities: this.id });

        if (clubs.some((club) => club.administrators.includes(user.id))) {
          return true;
        } else {
          return false;
        }
      }
    },
  },
})

export type TActivity = InferSchemaType<typeof activitySchema>;

export type ActivityParticipation = TActivity['participations'][0];

export const Activity = model('Activity', activitySchema);