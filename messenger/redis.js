import Redis from 'ioredis'

const redis = new Redis(process.env.MESSENGER_WEBHOOK_REDIS, {
  keyPrefix: 'messenger-bot'
})

export default redis
