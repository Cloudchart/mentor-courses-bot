import invariant from 'fbjs/lib/invariant'

import Action from './action'


export default class extends Action {

  constructor(config) {
    super(config)

    invariant(
      typeof config.resolve === 'function',
      `Fork Action error: 'resolve' field should be 'function'. Got '${config.resolve}'.`
    )
    this.resolveFn = config.resolve

    this.forks = { ...config.forks }
  }


  async resolve({ user, payload }, next) {
    let label = await this.resolveFn(user, payload)
    invariant(this.forks[label], `Fork Action error: unknown fork for label '${label}'.`)
    console.log(label)
    next(this.forks[label])
  }

}
