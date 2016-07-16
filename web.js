import express from 'express'
import bodyParser from 'body-parser'
import graphqlHTTP from 'express-graphql'

import Schema from './graphql/schema'
import routes from './routes'

import { r, run } from './stores'

const app = express()

app.set('view engine', 'pug')
app.set('views', './views')

app.use(bodyParser.json())
app.use(express.static('public'))
app.use('/', routes)


//
// Facebook webhook
//
// app.get('/facebook/:token', async (req, res, next) => {
//   if (req.query['hub.mode'] === 'subscribe') {
//     let bot = await run(r.table('bots').get(req.params.token))
//     if (bot) {
//       res.status(200).send(req.query['hub.challenge'])
//     } else {
//       res.sendStatus(403)
//     }
//   } else {
//     res.sendStatus(403)
//   }
// })
//
//
// app.post('/facebook/:token', async (req, res, next) => {
//
//   let bot = {
//     id    : req.params.token,
//     type  : 'facebook',
//   }
//
//   let { object, entry } = req.body
//
//   if (object === 'page') {
//     let updates = entry.reduce((memo, { messaging }) => {
//       return memo.concat(messaging.map(data => ({ ...data, bot })))
//     }, [])
//     await run(
//       r.table('updates').insert(updates)
//     )
//   }
//
//   // await run(
//   //   r.table('updates').insert({
//   //     ...req.body,
//   //     bot: {
//   //       id    : req.params.token,
//   //       type  : 'facebook'
//   //     }
//   //   })
//   // )
//
//   res.status(200).send('ok')
// })


app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port', process.env.PORT || 3000)
})
