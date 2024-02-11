import fs from 'fs'

// import { clubs } from './clubs.js'
// import { users } from './users.js'
// import { activities } from './activities.js'

import { Club } from '../models/Club.js'
import { User } from '../models/User.js'
import { Activity } from '../models/Activity.js'
import { Model } from '../types-db.js'

const dbPath = process.env['DB_PATH'] || './api/datas/db.json'

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
  console.info('Initializing db with', dbPath);

  const json = fs.readFileSync(dbPath, 'utf8')

  const rawData = JSON.parse(json)

  const data: DB = {
    clubs: rawData.clubs.map((club: any) => new Club(club)),
    users: rawData.users.map((user: any) => new User(user)),
    activities: rawData.activities.map((activity: any) => new Activity(activity))
  }

  Object.assign(db, data)
}

export function saveDb () {
  console.info('Saving db in', dbPath);

  const json = JSON.stringify(db, null, 2)

  fs.writeFileSync(dbPath, json)
}

export function getUniqId (collection: Model[]) {
  let id = Math.floor(Math.random() * 1000000).toString()

  while (collection.some((model) => model.id === id)) {
    id = Math.floor(Math.random() * 1000000).toString()
  }

  return id
}

setInterval(saveDb, 1000 * 60 * 5)