import fetch from 'fbjs/lib/fetch'


if (!process.env.TELEGRAM_API_URL)
  throw new Error(`Environment variable 'TELEGRAM_API_URL' not set.`)

if (!process.env.TELEGRAM_TOKEN)
  throw new Error(`Environment variable 'TELEGRAM_TOKEN' not set.`)


const TELEGRAM_UPDATE_TYPES = ['message', 'inline_query', 'choosen_inline_result', 'callback_query']

const Callbacks = TELEGRAM_UPDATE_TYPES.reduce((memo, updateType) => {
  memo[updateType] = [] ; return memo
}, {})

const Timeouts = {}


let lastUpdateId = 0


let sleep = (timeout) =>
  new Promise(done => setTimeout(done, timeout))


let url = (methodName) =>
  process.env.TELEGRAM_API_URL + '/bot' + process.env.TELEGRAM_TOKEN + '/' + methodName


let request = (methodName, payload) =>
  fetch(url(methodName), {
    method  : 'post',
    headers : {
      'Accept'        : 'application/json',
      'Content-Type'  : 'application/json',
    },
    body    : JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(({ ok, result, error_code, description }) => {
      if (ok === true)
        return result
      else
        throw new Error(JSON.stringify({ error_code, description }))
    })
    .catch(error => {
      if (typeof error === 'error')
        throw error
      else
        throw new Error(error)
    })


let on = (updateType, callback) => {
  if (!Callbacks[updateType]) {
    console.error(`Telegram 'on': Unknown update type: ${updateType}`)
    return
  }
  if (Callbacks[updateType].indexOf(callback) === -1)
    Callbacks[updateType].push(callback)
}


let off = (updateType, callback) => {
  if (!Callbacks[updateType]) {
    console.error(`Telegram 'off': Unknown update type: ${updateType}`)
    return
  }
  let index = Callbacks[updateType].indexOf(callback)
  if (index !== -1)
    Callbacks[updateType].splice(index, 1)
}


let handleUpdates = (updates) => {
  updates.forEach(update => {
    lastUpdateId = Math.max(lastUpdateId, update.update_id + 1)
    let updateType = TELEGRAM_UPDATE_TYPES.find(updateType => update[updateType])

    if (!updateType) {
      console.error(`Telegram 'getUpdates': Unknown update type: ${JSON.stringify(update, null, 2)}`)
      return
    }

    Callbacks[updateType].forEach(callback => callback(update[updateType]))
  })
}


let getUpdates = () =>
  request('getUpdates', {
    offset    : lastUpdateId,
    limit     : 2,
    timeout   : 60,
  })
    .then(handleUpdates)
    .then(getUpdates)
    .catch(error => {
      console.error(error)
      getUpdates()
    })


let sendMessage = async (payload) => {
  let timeout = 500 - new Date + (Timeouts[payload.chat_id] || 0)
  if (timeout > 0) await sleep(timeout)
  let message = await request('sendMessage', payload)
  Timeouts[payload.chat_id] = + new Date
  return message
}


let editMessageText = async (payload) => {
  return await request('editMessageText', payload)
}


let editMessageReplyMarkup = async (payload) => {
  return await request('editMessageReplyMarkup', payload)
}



export default {
  on,
  off,
  getUpdates,
  sendMessage,
  editMessageText,
  editMessageReplyMarkup,
}
