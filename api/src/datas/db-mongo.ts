import mongoose from 'mongoose'

class MongoDB {
  static uri = process.env['DB_URI'] || 'mongodb://127.0.0.1:27017/kayakons'

  constructor () {}

  async initDB () {
    await mongoose.connect(MongoDB.uri);
  }

  async closeDB () {
    await mongoose.disconnect()
  }
}

export const db = new MongoDB()

process.on('SIGINT', async function () {
  console.error('SIGINT in initDB')

  await mongoose.disconnect()

  console.info('Mongoose disconnected on app termination')
  process.exit(0)
})

process.on('message', async function (msg) {
  // console.info('msg', msg)

  if (msg === 'shutdown') {
    await mongoose.disconnect()
    console.info('Mongoose disconnected on app termination')
    process.exit(0)
  }
})