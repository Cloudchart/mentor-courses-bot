import invariant from 'fbjs/lib/invariant'

import Stores, { r, run } from '../stores'
import Action from './action'


class Scenario {

  constructor(config) {
    invariant(config.name, `Scenario error: 'name' field should be defined.`)
    this.name = config.name

    invariant(
      config.actions &&
      Array.isArray(config.actions) &&
      config.actions.length > 0,
      `Scenario error: 'actions' should be an array with at list one item.`
    )
    this.labels   = {}
    this.actions  = this._parseActions(config.actions)
  }


  async resolve(user, index, payload) {
    console.log(`Resolving scenario "${this.name}" at step ${index}.`)
    let should_continue = false
    let action = this.actions[index]

    if (!action)
      return

    await action.resolve({ user, ...payload }, (next = true) => { should_continue = next })

    payload = null

    let routes = await run(Stores.User.table.get(user.id)('routes').default([]))

    if (routes.length === 0 || routes[routes.length - 1].name !== this.name)
      routes.push({ name: this.name, step: index })
    else
      routes[routes.length - 1].step = index

    await run(Stores.User.table.get(user.id).update({ routes }))


    if (should_continue === false)
      return

    if (should_continue === true)
      return await this.resolve(user, index + 1, payload)

    return await this.resolve(user, this.labels[should_continue], payload)
  }


  _parseActions(actions) {
    return actions.map((config, ii) => {
      if (config.label)
        this.labels[config.label] = ii
      return Action.create(config)
    })
  }


}


export default Scenario
