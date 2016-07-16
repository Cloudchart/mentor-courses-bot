import Immutable from 'immutable'
import Relay from '../relay'


let loadUser = (id) =>
  Relay.query(id, 'viewer', {}, true)


let createUser = (id, attributes) =>
  Relay.mutation(id, 'createUser', {
    id        : attributes.id,
    firstName : attributes.first_name,
    lastName  : attributes.last_name,
    username  : attributes.username,
  })
    .then(() => loadUser(id))


class User {

  static async ensure(bot, id, attributes) {
    let user = await loadUser(id)
    if (!user)
      user = await createUser(id, attributes)
    return new User(bot, id, user)
  }


  constructor(bot, id, props) {
    this.bot = bot
    this.id = id
    this.props = props
    this.attributes = Immutable.fromJS(props)
    this.shouldResolvePendingMessage = false
  }


  get(path) {
    if (typeof path === 'string')
      path = path.split('.')
    return this.attributes.getIn([].concat(path))
  }


  update(data) {
    this.attributes = this.attributes.mergeDeep(Immutable.fromJS(data))
    return this
  }


  remove(path) {
    if (typeof path === 'string')
      path = path.split('.')
    return this.attributes.deleteIn([].concat(path))
  }


  async sendMessage(text, options = {}) {
    return this.bot.sendMessage(
      this,
      text.trim().replace(/\n[ \t]+/g, '\n'),
      options
    )
  }

}


export default {
  ensure: User.ensure
}
