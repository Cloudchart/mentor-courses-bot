import { Router } from 'express'

import FacebookRoutes from './facebook'
import TelegramRoutes from './telegram'

let router = new Router()

router.use('/facebook', FacebookRoutes)
router.use('/telegram', TelegramRoutes)

export default router
