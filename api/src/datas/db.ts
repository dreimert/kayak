import fs from 'fs'

// import { clubs } from './clubs.js'
// import { users } from './users.js'
// import { activities } from './activities.js'

import { Club } from '../models/Club.js'
import { User } from '../models/User.js'
import { Activity } from '../models/Activity.js'

export type DB = {
  clubs: Club[]
  users: User[]
  activities: Activity[]
}

export const db: DB = {
  clubs: [],
  users: [],
  activities: []
}

export function initDb () {
  console.info('Initializing db...');

  const json = fs.readFileSync(process.env['DB_PATH'] || './api/datas/db.json', 'utf8')

  const rawData = JSON.parse(json)

  const data: DB = {
    clubs: rawData.clubs.map((club: any) => new Club(club)),
    users: rawData.users.map((user: any) => new User(user)),
    activities: rawData.activities.map((activity: any) => new Activity(activity))
  }

  Object.assign(db, data)
}

export function saveDb () {
  console.info('Saving db...');

  const json = JSON.stringify(db, null, 2)

  fs.writeFileSync(process.env['DB_PATH'] || './api/datas/db.json', json)
}

setInterval(saveDb, 1000 * 60 * 5)