import invariant from 'fbjs/lib/invariant'

import Action from './action'

import {
  resolve as resolveScenario
} from '../'


export default class extends Action {

  constructor(config) {
    super(config)

    invariant(config.name, `Scenario Action error: 'name' field should be defined. Got '${config.name}'.`)
    this.name = config.name
  }


  async resolve(context, next) {
    context.route.stack[0].step++
    context.route.stack.unshift({
      scenario  : this.name,
      step      : 0
    })
    return await resolveScenario(context)
  }

}
