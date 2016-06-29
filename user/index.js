import Immutable from 'immutable'

import Relay from '../relay'

import {
  insightText,
  insightButtons
} from '../utils'


let resolveInlineKeyboard = (options = {}) => {
  return {
    inline_keyboard   : options.buttons || [],
  }
}


let resolveKeyboard = (options = {}) => {
  return {
    keyboard          : options.buttons || [],
    one_time_keyboard : options.one_time_keyboard || options.once || false,
    resize_keyboard   : true,
    hide_keyboard     : options.hide_keyboard || options.hide || false,
  }
}


let resolveReplyMarkup = ({ keyboard }) => {
  let reply_markup = { hide_keyboard: true }

  if (keyboard) {
    reply_markup = keyboard.inline
      ? resolveInlineKeyboard(keyboard)
      : resolveKeyboard(keyboard)
  }

  return reply_markup
}


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


  async query(name, variables = {}, force = false) {
    return await Relay.query(this.id, name, variables, force)
  }


  async mutation(name, variables = {}) {
    return await Relay.mutation(this.id, name, variables)
  }


  resolvePendingMessage() {
    this.shouldResolvePendingMessage = true
  }


  async _resolvePendingMessage() {
    if (!this.shouldResolvePendingMessage) return
    this.shouldResolvePendingMessage = false

    let data = await this.query('pendingMessage', {}, true)
    if (!data.pendingMessage) return

    switch(data.pendingMessage.sourceType) {
      case 'Insight':
        await this.resolvePendingInsight(
          data.pendingMessage.id,
          data.pendingMessage.sourceID
        )
        break
      case 'Dummy':
        await this.resolvePendingDummy(data.pendingMessage.id)
        break
    }

    await this.mutation('removeUserPendingMessage', { user: data })
  }


  async resolvePendingInsight(messageID, insightID) {
    let insight = await this.query('insight', { id: insightID }, true)
    let status = insight.rateByViewer
      ? insight.rateByViewer > 0 ? '👍' : '👎'
      : '💤'
    return this.editMessageText(insightText(insight, status), messageID, {
      keyboard: {
        inline  : true,
        buttons : insightButtons(insight, status)
      }
    })
  }


  async resolvePendingDummy(messageID) {
    return this.editMessageReplyMarkup(messageID, {
      keyboard: {
        inline  : true,
        buttons : []
      }
    })
  }


  async sendMessage(text, options = {}) {
    await this._resolvePendingMessage()

    let reply_markup = resolveReplyMarkup(options)

    return this.bot.sendMessage({
      chat_id       : this.id,
      text          : text.trim().replace(/\n[ \t]+/g, '\n'),
      parse_mode    : 'Markdown',
      reply_markup
    })
  }

  async editMessageText(text, message_id, options = {}) {
    let reply_markup = resolveReplyMarkup(options)

    return this.bot.editMessageText({
      chat_id     : this.id,
      message_id  : message_id,
      text        : text.trim().replace(/\n[ \t]+/g, '\n'),
      parse_mode  : 'Markdown',
      reply_markup
    })
  }

  async editMessageReplyMarkup(message_id, options = {}) {
    let reply_markup = resolveReplyMarkup(options)

    return this.bot.editMessageReplyMarkup({
      chat_id     : this.id,
      message_id  : message_id,
      parse_mode  : 'Markdown',
      reply_markup
    })
  }


  async finalize() {
    await Relay.mutation(this.id, 'pingUser', { id: this.id })

    if (this.attributes.equals(Immutable.fromJS(this.props))) return

    return Relay.mutation(this.id, 'updateUserScenario', {
      user          : this.props,
      scenarioName  : this.get('scenario.name'),
      sceneName     : this.get('scenario.scene.name')
    })
  }

}


export default {
  ensure: User.ensure
}
