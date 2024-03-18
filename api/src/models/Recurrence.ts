import { InferSchemaType, Schema } from "mongoose";

import { ActivityType } from "../enums/ActivityType.js";

export enum Day {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

const recurrencePatternSchema = new Schema({
  day: {
    type: Number,
    enum: Day,
    required: true,
  },
  hour: {
    type: Number,
    required: true,
    min: 0,
    max: 23,
  },
  minutes: {
    type: Number,
    required: true,
    min: 0,
    max: 59,
  },
})

export type RecurrencePattern = {
  day: Day,
  hour: number,
  minutes: number
}

export const recurrenceSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description:  {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ActivityType,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: Date,
  /**
   * Durée de l'activité en millisecondes
   */
  duration: {
    type: Number,
    required: true,
  },
  pattern: {
    type: recurrencePatternSchema,
    required: true,
  },
  coordinators: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
})

export type TRecurrence = InferSchemaType<typeof recurrenceSchema>