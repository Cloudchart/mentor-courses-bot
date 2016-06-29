import Factory from '../factory'


let resolveBotCommand = (message) => {
  let command = null
  let text = message.text || ''

  if (
    message.entities &&
    message.entities.length > 0 &&
    message.entities[0].type === 'bot_command' &&
    message.entities[0].offset === 0
  ) {
    command = message.text.slice(1, message.entities[0].length)
    text = message.text.slice(message.entities[0].length + 1)
  }

  return { command, text }
}


let resolve = (bot, { message }) => {
  let { command, text } = resolveBotCommand(message)
  Factory.resolve(bot, {
    type      : 'message',
    from      : message.from,
    command   : command,
    text      : text,
  })
}


export default {
  resolve
}
