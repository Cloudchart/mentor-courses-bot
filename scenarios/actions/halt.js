import Action from './action'


export default class extends Action {

  constructor(config) {
    super(config)

    // buttons

    this.commands = { ...config.commands }

    this.message = config.message
    this.next = config.next
  }


  resolve({ user, payload }, next) {
    console.log(`Resolving action 'halt'.`)
    console.log(payload)

    if (!payload)
      return

    if (payload.command)
      return this.resolve_command({ user, payload }, next)

    if (payload.text)
      return this.resolve_message({ user, payload }, next)

    if (payload)
      return next(this.next)
  }

  async resolve_command({ user, payload }, next) {
    let command = this.commands[payload.command]

    if (!command) {
      await user.sendMessage(`Unknown command _${payload.command}_`)
      if (this.next)
        return next(this.next)
      else
        return await this.resolve({ user }, next)
    }

    if (typeof command.resolve === 'function')
      await command.resolve(user)

    return next(command.label)
  }

  async resolve_message({ user, payload }, next) {
    if (typeof this.message === 'function')
      return await this.message(user, payload.text, next)

    next(this.next)
  }

}
