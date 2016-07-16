import qs from 'querystring'
import fetch from 'fbjs/lib/fetch'
import Immutable from 'immutable'
import { r, run } from '../../stores'


const Cache = {}


class Bot {

  static get(id) {
    if (Cache[id]) return Cache[id]

    return run(
      r.table('bots').get(id)
    ).then(record => {
      if (record === null || record === 'undefined')
        return null

      let { id, ...attributes } = record
      return Cache[id] = new Bot(id, attributes)
    })
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


  userProfile(bot_user_id) {
    return this._request(bot_user_id, {
      fields: ['first_name', 'last_name', 'profile_pic', 'locale', 'timezone', 'gender'].join(',')
    }, null, 'get')
  }


  sendTextMessage(user, text) {
    return this._request('me/messages', {}, {
      recipient: {
        id: user.get('bot_user_id')
      },
      message: {
        text: text
      }
    })
  }


  _request(path, query = {}, body = {}, method = 'post') {
    query = { ...query, access_token: this.get('token') }
    let url = process.env.MESSENGER_API_URL + '/' + path + '?' + qs.stringify(query)
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
        if (response.error)
          throw response.error
        else
          return response
      })
      .catch(error => {
        if (error instanceof Error)
          throw error
        else
          throw new Error(error)
      })
  }

}


export default Bot
