import invariant from 'fbjs/lib/invariant'

import Stores, { r, run } from '../stores'
import Action from './action'

import {
  resolve as resolveScenario
} from './'


class Scenario {

  constructor(config) {
    invariant(config.name, `Scenario error: 'name' field should be defined.`)
    this.name = config.name

    this.attributes = { ...config.attributes }

    invariant(
      config.actions &&
      Array.isArray(config.actions) &&
      config.actions.length > 0,
      `Scenario error: 'actions' should be an array with at list one item.`
    )
    this.labels   = {}
    this.actions  = this._parseActions(config.actions)
    this.commands = { ...config.commands }
  }


  async next(context) {

  }


  async resolve(step, context) {
    console.log(`Resolving scenario "${this.name}" at step ${step}.`)

    let action = this.actions[step]

    if (!action) {
      context.route.stack.shift()
      if (context.route.stack.length === 0)
        context.route.stack.unshift({ scenario: this.name, step: 0 })
      return await resolveScenario(context)
    }

    let state  = context.route.stack[0]

    let should_continue = false
    let nextStep = action._config.next || step + 1
    let nextPayload = null

    await action.resolve(context, (result = {}) => {
      should_continue = true
      console.log('SHOULD CONTINUE', should_continue)

      if (result.step !== null && result.step !== undefined)
        nextStep = result.step

      if (result.payload !== null && result.payload !== undefined)
        nextPayload = result.payload
    })

    state.step = step

    console.log(nextStep, nextPayload, should_continue)

    if (should_continue === false)
      return

    context.payload = nextPayload

    let nextActionIndex = typeof nextStep === 'string'
      ? this.labels[nextStep]
      : nextStep

    if (context.route.stack[0].scenario === this.name) {
      return await this.resolve(nextActionIndex, context)
    } else
      return await resolveScenario(context)
  }


  _parseActions(actions) {
    return actions.map((config, ii) => {
      if (config.label)
        this.labels[config.label] = ii
      return Action.create({ ...config, scenario: this, step: ii })
    })
  }


}


export default Scenario
