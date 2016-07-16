import { r, run } from '../stores'


let loadUser = async (bot_user_id) =>
  run(
    r.table('users')
      .getAll([bot_user_id, 'messenger'], { index: 'bot_user' })
      .limit(1)
  ).then(cursor => cursor.next()).catch(error => null)


let createUser = async (bot, bot_user_id) => {
  let attributes = await bot.userProfile(bot_user_id)
  run(
    r.table('users').insert({ ...attributes, bot_user_id, bot_type: 'messenger' })
  )
}


class User {

  static async ensure(bot, bot_user_id) {
    let user = await loadUser(bot_user_id)
    if (!user) {
      await createUser(bot, bot_user_id)
      user = await loadUser(bot_user_id)
    }
    let { id, ...attributes } = user
    return new User(id, attributes)
  }

  constructor(id, attributes = {}) {
    this.id = id
    this.attributes = attributes
  }

}


export default User
