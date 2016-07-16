import invariant from 'fbjs/lib/invariant'

import Action from './action'
import { r, run } from '../../stores'


export default class extends Action {

  constructor(config) {
    super(config)
    this.branch = { ...config.branch }
    this.timeout = config.timeout
  }


  handleTimeout(context) {
    let { route } = context
    let state = route.stack[0]
    if (this.timeout && this.timeout.duration)
      state.timeout = new Date(Date.now() + this.timeout.duration)
  }


  clearTimeout(context) {
    let { route } = context
    let { timeout, ...state } = route.stack[0]
    route.stack[0] = state
  }


  resolveTimeout(context, next) {
    let step = this.next

    if (this.timeout && this.timeout.next)
      step = this.timeout.next

    return next({ step })
  }


  async resolveCallback(context) {
    let payload = await run(
      r.table('users_bots')
        .get(context.user_bot_record_id)('payloads')
        .filter(payload => payload('id').eq(context.payload.data))
        .limit(1)
    ).then(cursor => cursor.next()).catch(error => null)

    if (typeof context.bot.answerCallbackQuery === 'function')
      await context.bot.answerCallbackQuery(context.payload.id)

    if (!payload) return false

    context.payload.text = payload.value

    return true
  }


  async resolve(context, next) {
    let { payload, scenario } = context

    if (!payload) return this.handleTimeout(context)

    this.clearTimeout(context)

    if (payload.timeout)
      return this.resolveTimeout(context, next)


    let shouldContinue = true

    if (payload.data)
      shouldContinue = await this.resolveCallback(context)

    if (!shouldContinue)
      return

    let message = (payload.text || '').trim().toLowerCase()

    if (scenario.commands.hasOwnProperty(message)) {
      let command = scenario.commands[message]
      if (typeof command === 'function')
        this.next = await command(context, next)
      else
        this.next = command
      return next({ step: this.next })
    }



    next({ step: this.branch[message] })
  }

}
