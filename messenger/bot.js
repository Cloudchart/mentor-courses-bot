import fetch from 'fbjs/lib/fetch'
import qs from 'querystring'

import { r, run } from '../stores'


class Bot {

  static async load(bot_id) {
    let bot = await run(
      r.table('bots')
        .filter(record => record('type').eq('messenger').and(record('bot_id').eq(bot_id)))
        .limit(1)
    ).then(cursor => cursor.next()).catch(null)

    if (!bot)
      throw new Error(`Messenger Bot error: Bot with id '${bot_id}' not found.`)

    let { id, ...attributes } = bot

    return new Bot(id, attributes)
  }

  constructor(id, attributes = {}) {
    this.id = id
    this.attributes = attributes
  }


  userProfile(user_id) {
    return this._request(user_id, {
      fields: ['first_name', 'last_name', 'profile_pic', 'locale', 'timezone', 'gender'].join(',')
    }, null, 'get')
  }


  sendImage(user, url) {
    return this._request('me/messages', null, {
      recipient: { id: user.attributes.bot_user_id },
      message: {
        attachment: { type: 'image', payload: { url } }
      }
    })
  }


  sendMessage(user, message, options = {}) {
    let quick_replies = null

    if (options.inline === true && options.buttons && options.buttons.length > 0)
      quick_replies = options.buttons.map(({ id, title }) => ({
        title         : title,
        payload       : id,
        content_type  : 'text',
      }))

    return this._request('me/messages', {}, {
      recipient: { id: user.attributes.bot_user_id },
      message: {
        text: message,
        quick_replies
      },
    }).catch(console.error)
  }


  textMessage(user, message) {
    return this._request('me/messages', {}, {
      recipient: { id: user.attributes.bot_user_id },
      message: { text: message }
    })
  }


  _request(path, query = {}, payload = {}, method = 'post') {
    query = { ...query, access_token: this.attributes.token }
    let url = process.env.MESSENGER_API_URL + '/' + path + '?' + qs.stringify(query)
    return fetch(url, {
      method  : method,
      body    : JSON.stringify(payload),
      headers : {
        'Accept'        : 'application/json',
        'Content-Type'  : 'application/json',
      },
    })
      .then(response => response.json())
      .catch(error => {
        if (typeof error === 'error')
          throw error
        else
          throw new Error(error)
      })
  }


}


export default Bot
