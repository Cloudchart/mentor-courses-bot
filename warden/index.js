import Bot from '../telegram/bot'
import Factory from '../factory'

import {
  r, run
} from '../stores'


const Table = r.table('user_bot_routes')


let Routes = {}
let performTimeout = null


const perform = async () => {
  clearTimeout(performTimeout)

  let nextTimeout = Infinity
  let nextRoutes = {}

  Object.keys(Routes).forEach(async (id, ii) => {
    let route = Routes[id]
    let { timeout, ...state } = route.stack[0]

    if (timeout < Date.now()) {
      try {
        route.stack[0] = state
        await run(Table.get(route.id).replace(route))
        let bot = await Bot.load(route.bot_id)
        Factory.resolve(bot, { from: { id: route.user_id }, timeout: true })
      } catch(error) {
        console.error(error)
      }
    } else {
      nextTimeout = Math.min(nextTimeout, timeout - Date.now())
      nextRoutes[id] = route
    }
  })

  Routes = nextRoutes

  console.log(nextTimeout)

  if (Object.keys(Routes).length === 0) return

  performTimeout = setTimeout(perform, nextTimeout)
}


const start = async () => {
  Routes = await loadRoutes().then(routes =>
    routes.reduce((memo, route) => {
      memo[route.id] = route
      return memo
    }, {})
  )
  perform()
}


const loadRoutes = () =>
  run(
    Table.filter(route => {
      return route('stack')(0)('timeout').default(0).gt(0)
    })
  ).then(cursor => cursor.toArray())


const checkRoute = (route) => {
  if (route.stack.length > 0 && route.stack[0].timeout) {
    Routes[route.id] = route
  } else {
    delete Routes[route.id]
  }
  perform()
}


export default {
  start,
  checkRoute,
}
