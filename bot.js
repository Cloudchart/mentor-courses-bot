import telegram from './telegram'

import {
  message as messageHandler,
  callback_query as callbackQueryHandler
} from './handlers'

import warden from './warden'


telegram.on('message', async (message) => {
  try {
    await messageHandler.resolve(message)
  } catch(error) {
    console.error('Bot on message error:', error)
  }
})


telegram.on('callback_query', async (callback_query) => {
  try {
    await callbackQueryHandler.resolve(callback_query)
  } catch(error) {
    console.error('Bot on callback query error:', error)
  }
})


telegram.getUpdates()

warden.start()
