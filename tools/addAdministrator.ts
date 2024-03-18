import { Club } from '../api/src/models/Club';
import { db } from '../api/src/datas/db-mongo';
import { User } from '../api/src/models/User';

await db.initDB()

const club = await Club.findById(process.argv[2])

if (!club) {
  throw new Error('Club not found')
}

const administrator = await User.findById(process.argv[3])

if (!administrator) {
  throw new Error('User not found')
}

club.administrators.push(administrator.id)

await club.save()

console.info(`Administrator ${administrator.name} added to club ${club.name}`);

await db.closeDB()