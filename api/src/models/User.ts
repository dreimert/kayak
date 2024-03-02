import mongoose, { InferSchemaType } from "mongoose";

import { ActivityType } from "../enums/ActivityType.js";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true },
  phone: String,
  domain: String,
  notifications: {
    type: [{
      type: String,
      enum: ActivityType,
    }],
    default: [],
  },
})

export type TUser = InferSchemaType<typeof userSchema>;

export const User = mongoose.model('User', userSchema);