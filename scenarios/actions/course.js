import invariant from 'fbjs/lib/invariant'

import Action from './action'

import { r, run } from '../../stores'

import {
  loadScenario,
  resolveScenario
} from '../'


let cleanupReadCards = async (user_bot_record_id, course_id) => {
  let courseCards = r.table('courses').get(course_id)('insights')
  let unreadCards = await run(r.table('users_bots').get(user_bot_record_id)('cards')('read').default([]).filter(card => r.not(courseCards.contains(card('id')))))

  let result = await run(
    r.table('users_bots').get(user_bot_record_id).update({
      cards: {
        read: unreadCards
      }
    })
  )
  console.log(result)
}


export default class extends Action {

  constructor(config) {
    super(config)

    invariant(
      typeof config.course === 'string' && config.course.length > 0,
      `Course Action error: 'course' field should be an id of course. Got '${config.course}'.`
    )

    this.branch = { ...config.branch }
    this.course = config.course
  }


  async resolve(context, next) {
    let { route, payload } = context

    if (route.stack[0].step === this.step) {
      console.log(`PAYLOAD:`, payload)

      let status = payload && payload.status || 'quit'
      if (this.branch.hasOwnProperty(status))
        this.next = this.branch[status]

      return next({ step: this.next })
    }


    await cleanupReadCards(context.user_bot_record_id, this.scenario.name)


    route.stack.unshift({
      scenario  : this.course,
      course    : this.course,
      step      : 0
    })

    return next()
  }

}
