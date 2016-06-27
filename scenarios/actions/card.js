import invariant from 'fbjs/lib/invariant'
import moment from 'moment'

import Action from './action'
import Stores, { r, run } from '../../stores'


let cardContent = (insight) => {
  return insight.content.trim().replace(/\[/g, '[[').replace(/\]/g, ']]')
}

let cardSource = (insight) => {
  let source = [insight.author, insight.origin && insight.origin.title].filter(part => !!part).join(', ')
  return source ? `\n_${source}_` : null
}

let cardDuration = (insight) => {
  let duration = insight.origin && insight.origin.duration && moment.duration(insight.origin.duration, 'seconds').humanize()
  return duration ? `\n_${duration} read_` : null
}

let renderCard = (insight) => {
  return [cardContent(insight), cardSource(insight), cardDuration(insight)].filter(part => !!part).join('\n')
}


let rateInsight = async (user, rate) => {
  let { insight, insights } = await run(Stores.User.table.get(user.id).pluck('insight', 'insights'))
  await run(
    Stores.User.table.get(user.id).update({
      insight: null,
      insights: (insights || []).concat({ id: insight, rate })
    })
  )
}


let nextInsight = async (user) => {
  let courseID = Stores.User.table.get(user.id)('course')
  let user_insights = Stores.User.table.get(user.id)('insights')('id').default([])
  let course_insights = Stores.Course.table.get(courseID)('insights').default([])

  return run(
    Stores.Insight.table.filter(insight => {
      let insightID = insight('id')
      return course_insights.contains(insightID).and(r.not(user_insights.contains(insightID)))
    }).limit(1)
  ).then(cursor => cursor.next())
}


export default class extends Action {

  constructor(config) {
    super(config)

    this.errors = { ...config.errors }
    this.commands = { ...config.commands }
  }


  async resolve({ user, payload }, next) {
    if (payload && payload.command)
      return await this.resolve_command(user, payload, next)

    if (payload && payload.text)
      return await this.resolve_message(user, payload, next)

    let insight = await nextInsight(user).catch(error => null)

    if (!insight)
      return next(this.errors.no_insights_left)

    await this.renderInsight(user, insight)
  }


  async renderInsight(user, insight) {
    await run(Stores.User.table.get(user.id).update({ insight: insight.id }))

    await user.sendMessage(renderCard(insight), {
      keyboard: {
        buttons: [[`Skip`, `I'll use it`]],
        one_time_keyboard: true,
      }
    })
  }


  async resolve_command(user, { command }, next) {
    let label = this.commands[command]

    switch (command) {
      case 'dropout':
        await run(Stores.User.table.get(user.id).replace(user => user.without('insight')))
        break
    }

    if (!label) {
      await user.sendMessage(`Unknown command _${command}_.`)
      return await this.resolve({ user }, next)
    }

    return next(label)
  }

  async resolve_message(user, { text }, next) {
    let message   = text.trim().toLowerCase()

    switch(message) {
      case `skip`:
        await rateInsight(user, -1)
        await user.sendMessage(`You skipped it.`)
        break
      case `i'll use it`:
        await rateInsight(user, +1)
        await user.sendMessage(`You saved it.`)
        break
      default:
        return next(this.errors.unknown_message)
    }

    return await this.resolve({ user }, next)
  }

}
