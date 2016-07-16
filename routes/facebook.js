import Redis from 'ioredis'
import { Router } from 'express'
import { r, run } from '../stores'

let router = Router();
let publisher = new Redis(process.env.REDIS_URL)


//
// Verification webhook
//
router.get('/:token', async (req, res) => {
  if (req.query['hub.mode'] === 'subscribe') {
    let bot = await run(r.table('bots').get(req.params.token))
    if (bot) {
      res.status(200).send(req.query['hub.challenge'])
    } else {
      res.sendStatus(403)
    }
  } else {
    res.sendStatus(403)
  }
})


//
// Updates webhook
//
router.post('/:token', async (req, res) => {
  let bot = {
    id    : req.params.token,
    type  : 'messenger',
  }

  let updates = req.body.entry.reduce((memo, { messaging }) => {
    return memo.concat(messaging.map(update => ({
      ...update,
      bot
    })))
  }, [])

  await run(
    r.table('updates').insert(updates)
  )

  publisher.publish('messenger', 'updates')

  res.sendStatus(200)
})


export default router
