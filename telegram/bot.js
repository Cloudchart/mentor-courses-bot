import fetch from 'fbjs/lib/fetch'

import { r, run } from '../stores'


let buildReplyMarkup = (options = {}) => {
  let reply_markup = {}

  if (options.inline === true && options.buttons && options.buttons.length > 0) {
    reply_markup.inline_keyboard = options.buttons.map(({ id, title }) => [{
      callback_data : id,
      text          : title,
    }])
  }

  return reply_markup
}


class Bot {


  static load = async (id) =>
    new Bot(await run(r.table('bots').get(id)))


  static Type = Symbol('telegram')


  constructor({ id, ...attributes }) {
    this.id = id
    this.type = Bot.Type
    this.attributes = attributes
    this.lastUpdateId = 0

    this.url = process.env.TELEGRAM_API_URL + '/bot' + this.attributes.token
  }


  getMe = () => this._request('getMe')

  sendMessage = (user, text, options = {}) => {
    let reply_markup = buildReplyMarkup(options)

    let payload = {
      chat_id     : user.id,
      parse_mode  : 'Markdown',
      reply_markup,
      text
    }

    this._request('sendMessage', payload)
  }


  sendImage(user, url) {
    
  }


  answerCallbackQuery = (callback_query_id, options = {}) => {
    this._request('answerCallbackQuery', {
      text        : options.text,
      show_alert  : options.show_alert,
      callback_query_id,
    })
  }


  getUpdates = () =>
    this._request('getUpdates', {
      offset    : this.lastUpdateId,
      limit     : 1,
      timeout   : 60,
    })
      .then(
        updates => {
          this.lastUpdateId = Math.max(this.lastUpdateId, ...updates.map(({ update_id }) => update_id + 1))
          return updates
        }
      )


  _request = (methodName, payload) =>
    fetch(this.url + '/' + methodName, {
      method  : 'post',
      headers : {
        'Accept'        : 'application/json',
        'Content-Type'  : 'application/json',
      },
      body    : JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(
        ({ ok, result, error_code, description }) => {
          if (ok === true)
            return result
          else
            throw new Error(JSON.stringify({ error_code, description }))
        }
      )
      .catch(
        error => {
          if (typeof error === 'error')
            throw error
          else
            throw new Error(error)
        }
      )


}


export default Bot
