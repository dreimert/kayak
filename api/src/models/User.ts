import { InferSchemaType, model, Schema } from "mongoose";

import { ActivityType } from "../enums/ActivityType.js";

const userSchema = new Schema({
  name: String,
  email: { type: String, required: true },
  phone: String,
  clubs: [{
    type: Schema.Types.ObjectId,
    ref: 'Club',
  }],
  notifications: {
    type: [{
      type: String,
      enum: ActivityType,
    }],
    default: [],
  },
})

export type TUser = InferSchemaType<typeof userSchema>;

export const User = model('User', userSchema);