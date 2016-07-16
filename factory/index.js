import User from '../user'
import { resolve as resolveScenario } from '../scenarios'


let locks = {}


let resolve = async (bot, payload) => {
  let user = await User.ensure(bot, payload.from.id, payload.from)

  if (locks[user.id]) return
  locks[user.id] = true

  try {

    console.log('Entering')

    let context = { user, bot, payload }

    await resolveScenario(context)

    console.log('Exiting')

  } catch (error) {
    console.error(error)
  }

  locks[user.id] = false
}


export default {
  resolve
}
