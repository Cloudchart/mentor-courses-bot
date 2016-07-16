import redis from './redis'
import Bot from './bot'
import User from './user'


const EVENTS = ['message', 'postback']

const Callbacks = {}

let on = (event, callback) => {
  let index = (Callbacks[event] || (Callbacks[event] = [])).indexOf(callback)
  if (index === -1)
    Callbacks[event] = Callbacks[event].concat(callback)
}


let handleEvent = async () => {
  if (await redis.llen(':events') === 0) return
  let event = JSON.parse(await redis.rpop(':events'))
  let callbacks = Callbacks[EVENTS.find(name => event.hasOwnProperty(name))]
  if (callbacks && callbacks.length > 0)
    callbacks.forEach(callback => callback(event))
  handleEvent()
}


let start = () => {
  let sub = redis.duplicate()
  sub.subscribe('messenger-mentor-bot')
  sub.on('message', handleEvent)
  handleEvent()
}


export default {
  on,
  start,

  Bot,
  User,
}
