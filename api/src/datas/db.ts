import fs from 'fs'

import { Club } from '../models/Club.js'
import { User } from '../models/User.js'
import { Activity } from '../models/Activity.js'

export const IdSize = 12

class DB {
  static dbPath = process.env['DB_PATH'] || './api/datas/db.json'

  clubs: Club[]
  users: User[]
  activities: Activity[]

  constructor (data: any = {}) {
    this.clubs = []
    this.users = []
    this.activities = []
  }

  save () {
    console.info('Saving db in', DB.dbPath);

    const json = JSON.stringify(this, null, 2)

    fs.writeFileSync(DB.dbPath, json)
  }

  loadDB () {
    console.info('Initializing db with', DB.dbPath);

    const json = fs.readFileSync(DB.dbPath, 'utf8')

    const rawData = JSON.parse(json)

    this.clubs = (rawData.clubs || []).map((club: any) => new Club(club))
    this.users = (rawData.users || []).map((user: any) => new User(user))
    this.activities = (rawData.activities || []).map((activity: any) => new Activity(activity))
  }
}

export const db = new DB()

setInterval(() => db.save(), 1000 * 60 * 5)

process.on('SIGINT', async function () {
  console.error('SIGINT in DB: save DB and exit')

  db.save()

  console.info('DB saved, exiting...')
  process.exit(0)
})