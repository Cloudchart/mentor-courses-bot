import Scene from '../../Scene'

import DailyScenario from '../daily'
import Outro from './outro'

import {
  insightText,
  insightButtons,
  resolveCallback,
} from '../../../utils'


let fetchInsight = (user) =>
  user.query('courseInsights', { first: 1, filter: 'UNRATED' }, true)
    .then(({ course }) =>
      course.insights.edges && course.insights.edges.map(({ node }) => node) || []
    )
    .then(insights => insights[0])


export default new Scene({

  name: 'Advice',


  commands: {

    dropout: async ({ user, scenario }) => {
      await user.mutation('unsubscribeUserFromCourse', { user })
      await user.sendMessage(`Ok, dropping out to slow loop.`)
      return DailyScenario.resolve({ user, scenario })
    }

  },


  resolveCallback: async (context, next) => {
    let { user, payload } = context

    let result = await resolveCallback(user, payload)

    return next()
  },


  resolveMessage: async (context, next) => {
    let { user, payload } = context
    await user.sendMessage(`Say what?`)
    return next()
  },


  resolve: async (context) => {
    let { user } = context

    let insight = await fetchInsight(user)

    if (!insight)
      return await Outro.resolve(context)

    // Send insight
    let message = await user.sendMessage(insightText(insight), {
      keyboard: {
        inline  : true,
        buttons : insightButtons(insight)
      }
    })

    // Set pending message
    await user.mutation('setPendingMessageToUser', {
      id          : message.message_id,
      sourceType  : 'Insight',
      sourceID    : insight.id,
      user,
    })
  }

})
