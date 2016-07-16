import fs from 'fs'
import path from 'path'

import Route from './route'
import Warden from '../warden'
import Scenario from './scenario'

import { r, run } from '../stores'


let loadedScenarios = {}


let loadScenario = (name) => {
  if (!loadedScenarios[name]) {
    let scenarioPath = `${path.join(__dirname, 'data', name)}`
    loadedScenarios[name] = new Scenario(require(scenarioPath).default)
  }
  return loadedScenarios[name]
}


let fetchUserBotRecord = (user, bot) =>
  run(
    r.table('users_bots').getAll([user.id, bot.id], { index: 'user_bot' })('id').limit(1)
  ).then(cursor => cursor.next()).catch(error => null)


let ensureUserBotRecord = async (user, bot) => {
  let user_bot_record_id = await fetchUserBotRecord(user, bot)

  if (!user_bot_record_id) {
    await run(
      r.table('users_bots').insert({ user_id: user.id, bot_id: bot.id })
    )
    user_bot_record_id = await fetchUserBotRecord(user, bot)
  }

  return user_bot_record_id
}


let resolve = async (context) => {
  let { route, user, bot } = context

  context.user_bot_record_id = await ensureUserBotRecord(user, bot)

  if (!route)
    route = await Route.findOrCreateRoute(user.id, bot.id)

  if (!route.stack || route.stack.length === 0)
    route.stack = [{
      scenario  : bot.scenario || 'intro',
      step      : 0,
    }]

  context.route = route

  let state = route.stack[0]

  let scenario = loadScenario(state.scenario)

  context.scenario = scenario

  await scenario.resolve(state.step, context)

  await Route.replaceRoute(context.route)

  await Warden.checkRoute(context.route)
}


export {
  resolve,
  resolve as resolveScenario,
  loadScenario,
}
