import invariant from 'fbjs/lib/invariant'

import { r, run } from '../../stores'
import Action from './action'


let rateCard = async (user_bot_record_id, card_id, should_save) => {
  let readQuery = r.table('users_bots').get(user_bot_record_id).update({
    cards: {
      read: r.row('cards')('read').default([]).append({ id: card_id })
    }
  })

  let saveQuery = r.table('users_bots').get(user_bot_record_id).update({
    cards: {
      save: r.row('cards')('save').default([]).append({ id: card_id })
    }
  })

  let result = await run(readQuery)
  console.log(result)

  if (should_save)
    await run(saveQuery)
}


export default class extends Action {

  constructor(config) {
    super(config)

    this.status = config.status
  }


  async resolve(context, next) {

    let { card } = context.route.stack[0]

    await rateCard(context.user_bot_record_id, card, this.status === 'save')

    next()

  }

}
