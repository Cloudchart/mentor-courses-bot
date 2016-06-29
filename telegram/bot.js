import fetch from 'fbjs/lib/fetch'


class Bot {


  constructor(token) {
    this.url = process.env.TELEGRAM_API_URL + '/bot' + token
    this.lastUpdateId = 0
  }


  getMe = () => this._request('getMe')

  sendMessage = (payload) => this._request('sendMessage', payload)

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
