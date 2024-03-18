import { connect, disconnect } from 'mongoose'

export const DB_URI = process.env['DB_URI'] || 'mongodb://127.0.0.1:27017/kayakons'

class MongoDB {
  constructor () {}

  async initDB () {
    await connect(DB_URI);
  }

  async closeDB () {
    await disconnect()
  }
}

export const db = new MongoDB()

process.on('SIGINT', async function () {
  console.error('SIGINT in initDB')

  await disconnect()

  console.info('Mongoose disconnected on app termination')
  process.exit(0)
})

process.on('message', async function (msg) {
  // console.info('msg', msg)

  if (msg === 'shutdown') {
    await disconnect()
    console.info('Mongoose disconnected on app termination')
    process.exit(0)
  }
})