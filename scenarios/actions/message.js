import invariant from 'fbjs/lib/invariant'

import Action from './action'
import { r, run } from '../../stores'


export default class extends Action {

  constructor(config) {
    super(config)

    invariant(config.text, `Message Action error: 'text' field should be defined. Got '${config.text}'.`)
    this.text = config.text
    this.keyboard = { buttons: [], inline: false, ...config.keyboard }
  }


  async preparePayloads(context) {
    let payloads = this.keyboard.buttons.map(async button => {
      let id = await run(r.uuid())
      return { id, value: button, title: button }
    })

    payloads = await Promise.all(payloads)

    await run(r.table('users_bots').get(context.user_bot_record_id).update({ payloads }))

    return payloads
  }


  async resolve(context, next) {
    let message = typeof this.text === 'function' ? await this.text(context) : this.text

    let buttons = await this.preparePayloads(context)

    await context.bot.sendMessage(context.user, message, {
      ...this.keyboard,
      buttons
    })

    next()
  }

}
