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

  if (event_type === null || event_type === undefined) {
    console.log('Messenger bot: skipping unknown update:')
    console.log(JSON.stringify(update, null, 2))
    return
  }

  if (event_type === 'message' && update.message.is_echo === true) {
    console.log('Messenger bot: skipping update of message echo type.')
    return
  }

  bot_instance = await Bot.get(bot.id).catch(error => null)
  if (!bot_instance) {
    console.log(`Messenger bot error: cannot find bot with id '${bot.id}'.`)
    return
  }

  if (!bot_instance.get('token')) {
    console.log(`Messenger bot error: cannot find token for bot '${bot_instance.id}'.`)
    return
  }

  let user_instance = await User.ensure(bot_instance, sender.id).catch(error => null)
  if (!user_instance) {
    console.log(`Messenger bot error: cannot find user with id '${sender.id}' for bot '${bot_instance.id}'.`)
    return
  }

  let payload = {
    bot     : bot_instance,
    user    : user_instance,
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

  Subscriber.subscribe('messenger')
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
