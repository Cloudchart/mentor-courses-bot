import Immutable from 'immutable'

import { r, run } from '../../stores'


const instantiateRecord = (record) => {

  let { id, ...attributes } = record
  return new User(id, attributes)
}


class User {

  static get(id) {
    return run(
      r.table('users').get(id)
    )
      .then(record => {
        if (record === null || record === undefined)
          throw new Error(`Telegram User error: user with id '${id}' not found.`)
      })
      .then(instantiateRecord)
  }

  static getByBotUserId(bot_user_id) {
    return run(
      r.table('users').getAll(['telegram', bot_user_id], { index: 'bot_type_and_bot_user_id' }).limit(1)
    )
      .then(cursor => cursor.next())
      .then(instantiateRecord)
      .catch(error => {
        if (error instanceof Error)
          throw error
        else
          throw new Error(error)
      })
  }

  static async ensure(bot_user_id, attributes = {}) {
    let user = await User.getByBotUserId(bot_user_id).catch(error => null)
    if (!user) {
      await User.create({
        ...attributes,
        bot_user_id
      })
      user = await User.getByBotUserId(bot_user_id)
    }
    return user
  }

  static create(attributes = {}) {
    return run(
      r.table('users').insert({
        ...attributes,
        bot_type: 'telegram'
      })
    )
  }

  constructor(id, attributes) {
    this.id = id
    this.attributes = Immutable.fromJS(attributes)
  }

  get(path) {
    if (typeof path.split === 'function')
      path = path.split('.')
    path = [].concat(path)
    return this.attributes.getIn(path)
  }

}


export default User
