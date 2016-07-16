import bots from './bots'

let {
  messenger,
  telegram,
} = bots


// Messenger message handler
//
messenger.on('message', async ({ bot, user, payload }) => {
  console.log('Handling messenger payload of type "message".')
  await bot.sendTextMessage(user, 'Echo: message received')
})

// Messenger postback handler
//
messenger.on('postback', async (payload) => {
  console.log('Handling messenger payload of type "postback".')
  await bot.sendTextMessage(user, 'Echo: postback received')
})

// Start messenger bots
//
messenger.start()


// Telegram message handler
//
telegram.on('message', async ({ bot, user, payload }) => {
  console.log('Handling telegram payload of type "message".')
  await bot.sendTextMessage(user, 'Echo: message received')
})

// Telegram callback query handler
//
telegram.on('callback_query', async ({ bot, user, payload }) => {
  console.log('Handling telegram payload of type "callback_query".')
  await bot.sendTextMessage(user, 'Echo: callback query received')
})

// Start telegram bots
//
telegram.start()


// Start Warden
//
