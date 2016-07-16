import qs from 'querystring'
import fetch from 'fbjs/lib/fetch'
import Immutable from 'immutable'

import { r, run } from '../../stores'


const Cache = {}


class Bot {

  static get(id) {
    if (Cache[id])
      return Cache[id]

    return run(
      r.table('bots').get(id)
    ).then(({ id, ...attributes }) => Cache[id] = new Bot(id, attributes))
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


  setWebhook(url) {
    return this._request('setWebhook', null, {
      url: url + '/' + this.id
    })
  }

  sendTextMessage(user, text) {
    return this._request('sendMessage', null, {
      chat_id : user.get('chat.id'),
      text    : text
    })
  }


  _request(path, query = {}, body = {}, method = 'post') {
    query = { ...query }
    let url = process.env.TELEGRAM_API_URL + '/bot' + this.get('token') + '/' + path + '?' + qs.stringify(query)
    return fetch(url, {
      method  : method,
      body    : JSON.stringify(body),
      headers : {
        'Accept'        : 'application/json',
        'Content-Type'  : 'application/json',
      },
    })
      .then(response => response.json())
      .then(response => {
        if (response.ok === true)
          return response
        else
          throw new Error(response)
      })
      .catch(error => {
        if (typeof error === 'error')
          throw error
        else
          throw new Error(error)
      })
  }


}


export default Bot
