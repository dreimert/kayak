import { InferSchemaType, Schema, Types, model } from "mongoose";

import { ActivityType } from "../enums/ActivityType.js";
import { ParticipationType } from "../enums/ParticipationType.js";

export type ActivityParticipation = {
  participant: Types.ObjectId
  type: ParticipationType
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
})

export type TActivity = InferSchemaType<typeof activitySchema>;

export const Activity = model('Activity', activitySchema);