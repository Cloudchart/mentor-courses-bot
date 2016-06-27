import invariant from 'fbjs/lib/invariant'

import Action from './action'


export default class extends Action {

  constructor(config) {
    super(config)

    invariant(config.text, `Message Action error: 'text' field should be defined. Got '${config.text}'.`)
    this.text = config.text

    this.resolveFn = config.resolve

    this.keyboard = { ...config.keyboard }
  }

  async resolve({ user }, next) {
    if (typeof this.resolveFn === 'function')
      await this.resolveFn(user)

    let message = typeof this.text === 'function' ? await this.text(user) : this.text
    let buttons = typeof this.keyboard.buttons === 'function' ? await this.keyboard.buttons(user) : this.keyboard.buttons
    await user.sendMessage(message, {
      keyboard: {
        ...this.keyboard,
        buttons
      }
    })
    next(this.next)
  }

}
