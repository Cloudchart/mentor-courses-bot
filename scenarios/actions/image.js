import invariant from 'fbjs/lib/invariant'

import Action from './action'
import { r, run } from '../../stores'


export default class extends Action {

  constructor(config) {
    super(config)
    this.url = config.url
  }


  async resolve(context, next) {
    await context.bot.sendImage(context.user, this.url)
    next()
  }

}
