import invariant from 'fbjs/lib/invariant'

import Action from './action'

export default class extends Action {

  constructor(config) {
    super(config)

    this.course = config.course
    this.branch = { ...config.branch }
  }


  async resolve(context, next) {
    let { route, payload } = context

    if (route.stack[0].step === this.step) {

      let status = payload && payload.status || 'quit'
      let step = this.branch.hasOwnProperty(status) ? this.branch[status] : this.next

      return next({ step, payload: { status } })
    }

    route.stack.unshift({
      scenario  : 'card-list',
      course    : this.course,
      step      : 0
    })

    return next()
  }

}
