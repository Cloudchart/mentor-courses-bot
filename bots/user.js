import Immutable from 'immutable'

import { r, run } from '../stores'


const Cache = {}


class User {


  static get(id) {
    if (Cache[id]) return Cache[id]

    return run(
      r.table('users').get(id)
    )
      .then(record => {
        if (record === null) return null
        let { id, ...attributes } = record
        return Cache[id] = new User(id, attributes)
      })
  }


  static getForBot(bot_type, bot_user_id) {
    const cache_key = bot_type + ':' + bot_user_id
    if (Cache[cache_key]) return Cache[cache_key]

    return run(
      r.table('users').getAll([bot_type, bot_user_id], { index: 'bot_type_and_bot_user_id' }).limit(1)
    )
      .then(cursor => cursor.next())
      .then(record => {
        if (record === null) return null
        let { id, ...attributes } = record
        return Cache[id] = Cache[cache_key] = new User(id, attributes)
      })
      .catch(error => {
        return null
      })
  }


  static create({ id, ...attributes }) {
    return run(
      r.table('users').insert(attributes)
    ).then(({ generated_keys }) => User.get(generated_keys[0]))
  }


  constructor(id, attributes) {
    this.id = id
    this.attributes = Immutable.fromJS(attributes)
  }


  get(path) {
    if (path instanceof String)
      path = path.split('.')
    path = [].concat(path)
    return this.attributes.getIn(path)
  }


}


export default User
