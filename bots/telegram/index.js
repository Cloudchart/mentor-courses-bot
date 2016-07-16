import Redis from 'ioredis'

import Bot from './bot'
import User from './user'

import { r, run } from '../../stores'

const EventTypes = ['message', 'callback_query']
const Callbacks  = {
  message         : [],
  callback_query  : []
}
const Subscriber = new Redis(process.env.REDIS_URL)

let locked = false



let handleUpdate = async ({ id, bot, ...update }) => {
  let event_type = EventTypes.find(event_type => update.hasOwnProperty(event_type))

  if (event_type === null || event_type === undefined) {
    console.log('Telegram bot: skipping unknown update:')
    console.log(JSON.stringify(update, null, 2))
    return
  }

  let bot_instance = await Bot.get(bot.id)
  if (!bot_instance) {
    console.log(`Telegram bot error: cannot find bot with id '${bot.id}'.`)
    return
  }

  if (!bot_instance.get('token')) {
    console.log(`Telegram bot error: cannot find token for bot '${bot_instance.id}'.`)
    return
  }

  let user = update[event_type].from
  let user_instance = await User.ensure(bot_instance, user.id, user)
  if (!user_instance) {
    console.log(`Telegram bot error: cannot find user with id '${user.id}' for bot '${bot_instance.id}'.`)
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
    r.table('updates').filter({ bot: { type: 'telegram' } }).orderBy('update_id')
  ).then(cursor => cursor.toArray())

  if (updates.length === 0) return

  locked = true

  try {
    await Promise.all(updates.map(handleUpdate))
  } catch(error) {
    console.error(error)
  }

  await run(
    r.table('updates').getAll(...updates.map(({ id }) => id)).delete()
  )

  locked = false

  handleUpdates()
}


const start_bot = async (id) => {
  let bot = await Bot.get(id)
  await bot.setWebhook(process.env.HOST + '/' + process.env.WEBHOOKS_PREFIX + '/telegram').catch(error => console.error(error))
}


const start = async () => {
  try {

    await run(
      r.table('bots').filter(bot => bot('type').eq('telegram'))('id')
    ).then(cursor => cursor.each(start_bot)).catch(error => null)

    Subscriber.subscribe('telegram')
    Subscriber.on('message', handleUpdates)

    handleUpdates()

  } catch(error) {

    console.error(error)

  }
}


const on = (event, callback) => {
  if (Callbacks[event] && Callbacks[event].indexOf(callback) === -1)
    Callbacks[event] = Callbacks[event].concat(callback)
}


export default {
  start,
  on,
}
