import { r, run } from '../stores'
import Bot from './bot'

const EVENTS = ['message', 'inline_query', 'choosen_inline_result', 'callback_query']

let callbacks = {}


let getUpdates = (bot, callback) =>
  bot
    .getUpdates()
    .then(callback(bot))
    .then(() => getUpdates(bot, callback))


let start = () =>
  run(r.table('bots').filter({ type: 'telegram' }))
    .then( cursor => cursor.eachAsync(({ token }) => getUpdates(new Bot(token), handleUpdates)) )



let handleUpdates = (bot) =>
  (updates) =>
    updates.forEach(
      update => (callbacks[EVENTS.find(event => update[event])] || []).forEach(callback => callback(bot, update))
    )


let on = (event, callback) => {
  let index = (callbacks[event] || (callbacks[event] = [])).indexOf(callback)
  if (index === -1)
    callbacks[event].push(callback)
}


let off = (event, callback) => {
  let index = (callbacks[event] || (callbacks[event] = [])).indexOf(callback)
  if (index !== -1)
    callbacks[event].splice(index, 1)
}


export default {
  on,
  off,
  start,
}
