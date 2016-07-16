import Redis from 'ioredis'

import Bot from './bot'
import User from './user'

import { r, run } from '../../stores'

const EventTypes = ['message', 'postback']
const Callbacks  = {
  message   : [],
  postback  : []
}
const Subscriber = new Redis(process.env.REDIS_URL)

let locked = false


const handleUpdate = async ({ id, bot, ...update }) => {
  let { sender, recipient } = update
  let event_type = EventTypes.find(event_type => update.hasOwnProperty(event_type))

  bot = await Bot.get(bot.id)
  let user = await User.ensure(bot, sender.id)

  let payload = {
    bot     : bot,
    user    : user,
    source  : 'client',
    payload : {
      type  : event_type,
      data  : update[event_type],
    }
  }

  Callbacks[event_type].forEach(callback => callback(payload))

}


const handleUpdates = async (channel, message) => {
  if (locked === true) return

  let updates = await run(
    r.table('updates').filter({ bot: { type: 'messenger' } }).orderBy('timestamp')
  ).then(cursor => cursor.toArray())

  if (updates.length === 0) return

  locked = true

  await Promise.all(updates.map(handleUpdate))

  await run(
    r.table('updates').getAll(...updates.map(({ id }) => id)).delete()
  )

  locked = false

  handleUpdates()
}


const start = () => {

  Subscriber.subscribe('facebook')
  Subscriber.on('message', handleUpdates)

  handleUpdates()

}


const on = (event, callback) => {
  if (Callbacks[event] && Callbacks[event].indexOf(callback) === -1)
    Callbacks[event] = Callbacks[event].concat(callback)
}


export default {
  start,
  on,
}
