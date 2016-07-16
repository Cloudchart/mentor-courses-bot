import Immutable from 'immutable'

import Base from '../user'
import { r, run } from '../../stores'


class User extends Base {

  static async ensure(bot, bot_user_id, attributes) {
    let user = await User.getForBot(bot.get('type'), bot_user_id)
    if (!user) {
      await User.create({
        ...attributes,
        bot_type    : bot.get('type'),
        bot_user_id : bot_user_id,
      })
      user = await User.getForBot(bot.get('type'), bot_user_id)
    }
    return user
  }

}


export default User
