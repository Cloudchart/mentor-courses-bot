import invariant from 'fbjs/lib/invariant'
import moment from 'moment'

import Action from './action'


export default class extends Action {

  constructor(config) {
    super(config)

    invariant(
      !isNaN(config.timeout) && config.timeout > 0,
      `Sleep action error: 'timeout' field should be a number in seconds greater then 0. Got '${config.timeout}'.`
    )

    this.timeout = config.timeout
  }


  async resolve(context, next) {
    let { route, user, payload } = context

    if (payload && payload.timeout)
      return next()

    if (route.stack[0].step === this.step)
      return await user.sendMessage(`Wait ${moment.duration(Date.now() - route.stack[0].timeout).humanize()} please!`)

    route.stack[0].timeout = new Date(Date.now() + this.timeout)
  }

}
