import Redis from 'ioredis'
import { Router } from 'express'
import { r, run } from '../stores'

let router = Router();
let publisher = new Redis(process.env.REDIS_URL)


router.post('/:token', async (req, res) => {
    await run(
      r.table('updates').insert({
        ...req.body,
        bot: {
          id    : req.params.token,
          type  : 'telegram'
        }
      })
    )

    publisher.publish('telegram', 'updates')

    res.sendStatus(200)
})


export default router
