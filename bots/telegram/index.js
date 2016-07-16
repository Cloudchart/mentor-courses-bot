import Redis from 'ioredis'

import Bot from './bot'
import User from './user'

import { r, run } from '../../stores'

const Subscriber = new Redis(process.env.REDIS_URL)
const Callbacks  = {
  message         : [],
  callback_query  : []
}
let locked = false


let handleUpdate = ({ id, bot, ...update }) => {
  console.log(update)
}


const handleUpdates = async (channel, message) => {
  console.log(channel, message)
}


const start_bot = async (id) => {
  let bot = await Bot.get(id)
  await bot.setWebhook(process.env.HOST + '/' + process.env.WEBHOOKS_PREFIX + '/telegram').catch(error => console.error(error))
}


const start = async () => {
  try {
    await run(
      r.table('bots').filter(bot => bot('type').eq('telegram'))('id')
    ).then(cursor => cursor.next()).then(start_bot).catch(console.error)

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
