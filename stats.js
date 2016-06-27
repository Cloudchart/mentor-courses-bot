import moment from 'moment'
import Redis from 'ioredis'

let redis = new Redis('redis://mentor1.cochart.net', {
  keyPrefix: 'mentor-telegram-bot'
})

redis.smembers(':users')
  .then(ids => {
    let now = moment.utc()
    ids.forEach(async id => {
      let [message, callback] = await redis.hmget(`:user:${id}`, 'last_message_received_at', 'last_callback_query_received_at')
      let activeAt = Math.max(parseFloat(message) || 0, parseFloat(callback) || 0)
      if (activeAt > 0 && now.diff(moment.utc(activeAt), 'days') < 7)
        console.log(id)
    })
  })
