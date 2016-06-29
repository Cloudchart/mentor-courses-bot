import telegram from './telegram'

import {
  message as messageHandler,
} from './handlers'


telegram.on('message', async (bot, update) => {
  try {
    await messageHandler.resolve(bot, update)
  } catch(error) {
    console.error('Bot on message error:', error)
  }
})

telegram.on('callback_query', async (bot, update) => {
  try {
    await callbackQueryHandler.resolve(bot, update)
  } catch(error) {
    console.error('Bot on callback query error:', error)
  }
})


telegram.start()
