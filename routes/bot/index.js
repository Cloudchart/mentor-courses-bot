import { Router } from 'express'
import { r, run } from '../../stores'

let router = Router();


const Types = ['messenger', 'telegram']

const validate = ({ title, token, type }) => {
  let errors = []

  if (title === null || title === undefined || title.length === 0)
    errors.push({ title: 'empty' })

  if (token === null || token === undefined || token.length === 0)
    errors.push({ token: 'empty' })

  if (Types.indexOf(type) === -1)
    errors.push({ type: 'unknown' })

  return errors.length === 0 ? null : errors
}


router.get('/', async (req, res) => {
  let bots = await run(r.table('bots')).then(cursor => cursor.toArray())
  res.render('bots/index', { props: JSON.stringify({ bots }) })
})

router.get('/new', async (req, res) => {
  res.render('bots/new', { props: JSON.stringify({}) })
})

router.post('/', async (req, res) => {
  let errors = validate(req.body)
  res.json({ ...req.body, errors })
})


export default router
