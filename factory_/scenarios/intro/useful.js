import Scene from '../../Scene'

import {
  insightText
} from '../../../utils'

import UsefulAdvicePrompt from './useful_prompt'


let fetchInsight = (user) =>
  user.query('insights', { first: 1, filter: 'FAKE_USEFUL' }, true)
    .then(({ insights }) =>
      insights.edges && insights.edges.map(({ node }) => node) || []
    )
    .then(insights => insights[0])


export default new Scene({

  name: 'UsefulAdvice',


  resolve: async ({ user, scenario }) => {
    let insight = await fetchInsight(user)

    // Send insight
    let message = await user.sendMessage(insightText(insight), {
      keyboard: {
        inline  : true,
        buttons : [[{ text: `I'll use it`, callback_data: 'positive' }]]
      }
    })

    // Set pending message
    await user.mutation('setPendingMessageToUser', {
      id          : message.message_id,
      sourceType  : 'Insight',
      sourceID    : insight.id,
      user,
    })

    await user.sendMessage(`Now press "I'll use it" to save advice to your collection.`)

    return UsefulAdvicePrompt.activate({ user, scenario })
  }


})
