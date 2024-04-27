import { Club } from "../models/Club";
import { db } from "./db-mongo";
import { Activity, IActivityMethods, TActivity } from '../models/Activity';
import mongoose, { HydratedDocument } from 'mongoose';

mongoose.set('strict', false);
mongoose.set('strictQuery', false);

await db.initDB()

const clubs = await Club.find({})
const recurrences = clubs.flatMap(club => club.recurrences)

const activities = await Activity.where('recurring').equals('true')

for (const activity of activities) {
  const start = activity.start

  const recurrence = recurrences.find(recurrence => {
    if (recurrence.title === activity.title) {
      return true
    } else {
      return false
    }
  })

  if (!recurrence) {
    console.error(`No recurrence found for activity ${activity.title} : ${activity._id}`)
  }

  activity.recurring = `${recurrence?.id}-${start.getMonth()}-${start.getDate()}`

  await (activity as HydratedDocument<TActivity, IActivityMethods>).save()
}

await db.closeDB()