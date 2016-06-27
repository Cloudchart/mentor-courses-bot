import User from '../user'
import Stores, { r, run } from '../stores'
import { resolve as resolveScenario } from '../scenarios'


let locks = {}


let resolve = async (payload) => {
  let user = await User.ensure(payload.from.id, payload.from)

  if (locks[user.id]) return
  locks[user.id] = true

  try {

    console.log('Entering')

    let routes = await run(Stores.User.table.get(user.id)('routes').default([]))
    let route = routes[routes.length - 1] || { name: 'main', step: 0 }

    await resolveScenario(route.name, route.step, { user, payload })

    console.log('Exiting')

  } catch (error) {
    console.error(error)
  }

  locks[user.id] = false
}


export default {
  resolve
}
