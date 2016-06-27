import Action from './action'
import Stores, { run } from '../../stores'


export default class extends Action {

  constructor(config) {
    super(config)

    this.commands = { ...config.commands }
  }


  async resolve({ user, payload }, next) {
    let courses = await run(Stores.Course.table.pluck('id', 'name', 'author')).then(cursor => cursor.toArray())

    if (!payload)
      return await this.renderCourses(user, courses, next)

    if (payload.command)
      return await this.resolve_command(user, payload, next)

    if (payload.text)
      return await this.resolve_message(user, courses, payload.text, next)
  }


  async resolve_message(user, courses, message, next) {
    let query = message.trim().toLowerCase()
    let course = courses.find(course => course.name.toLowerCase() === query)

    if (!course) {
      await user.sendMessage(`Course *${message}* not found.`)
      return await this.renderCourses(user, courses, next)
    }

    await run(Stores.User.table.get(user.id).update({ course: course.id }))

    next()
  }


  async resolve_command(user, payload, next) {
    let command = this.commands[payload.command]

    if (!command) {
      await user.sendMessage(`Unknown command *${payload.command}*.`)
      return await this.resolve({ user }, next)
    }

    return next(command.label)
  }


  async renderCourses(user, courses, next) {
    await user.sendMessage('Choose a course: \n\nOr type /cancel.', {
      keyboard: {
        buttons: courses.map(course => [course.name]),
        one_time_keyboard: true,
      }
    })
  }

}
