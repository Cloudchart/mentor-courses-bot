import invariant from 'fbjs/lib/invariant'

import { r, run } from '../../stores'
import Action from './action'


export default class extends Action {


  constructor(config) {
    super(config)
    this.branch = { ...config.branch }
  }


  async fetchCard(user_bot_record_id, course_id) {
    let readCards = r.table('users_bots').get(user_bot_record_id)('cards')('read')('id').default([])

    let courseCards = r.table('courses').get(course_id)('insights').default([])

    return run(
      r.table('insights').filter(insight => {
        return courseCards.contains(insight('id')).and(r.not(readCards.contains(insight('id'))))
      }).pluck('id').limit(1)
    ).then(cursor => cursor.next()).catch(error => null)
  }


  async resolve(context, next) {
    let { course } = context.route.stack[0]

    let card = await this.fetchCard(context.user_bot_record_id, course)

    if (!card) {
      let step = this.next
      if (this.branch.hasOwnProperty('empty'))
        step = this.branch.empty
      context.route.stack.shift()
      return next({ step, payload: { status: 'empty' } })
    }

    context.route.stack[0].card = card.id

    next()
  }

}
