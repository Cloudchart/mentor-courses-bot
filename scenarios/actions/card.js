import invariant from 'fbjs/lib/invariant'

import Action from './action'

export default class extends Action {

  constructor(config) {
    super(config)
  }


  async resolve(context, next) {
    let { route, payload } = context

    if (route.stack[0].step === this.step)
      return next()

    route.stack.unshift({
      scenario  : 'card',
      card      : route.stack[0].card,
      step      : 0
    })

    return next()
  }

}
