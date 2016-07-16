import invariant from 'fbjs/lib/invariant'

import Action from './action'


export default class extends Action {

  constructor(config) {
    super(config)
    this.status = config.status || 'quit'
  }


  async resolve(context, next) {
    let { route } = context
    route.stack.shift()
    return next({ payload: { status: this.status } })
  }

}
