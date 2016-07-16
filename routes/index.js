import { Router } from 'express'

import FacebookRoutes from './facebook'
import TelegramRoutes from './telegram'

let router = new Router()

let bots_prefix = process.env.WEBHOOKS_PREFIX

console.log(bots_prefix)

router.use('/' + bots_prefix + '/facebook', FacebookRoutes)
router.use('/' + bots_prefix + '/telegram', TelegramRoutes)

export default router
