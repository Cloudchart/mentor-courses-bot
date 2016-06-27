import Scene from '../../Scene'

import {
  insightText
} from '../../../utils'

import UselessAdvicePrompt from './useless_prompt'


let fetchInsight = (user) =>
  user.query('insights', { first: 1, filter: 'FAKE_USELESS' }, true)
    .then(({ insights }) =>
      insights.edges && insights.edges.map(({ node }) => node) || []
    )
    .then(insights => insights[0])


export default new Scene({

  name: 'UselessAdvice',


  resolve: async ({ user, scenario }) => {
    let insight = await fetchInsight(user)

    // Send insight
    let message = await user.sendMessage(insightText(insight), {
      keyboard: {
        inline  : true,
        buttons : [[{ text: `Skip`, callback_data: 'negative' }]]
      }
    })

    // Set pending message
    await user.mutation('setPendingMessageToUser', {
      id          : message.message_id,
      sourceType  : 'Insight',
      sourceID    : insight.id,
      user,
    })

    await user.sendMessage(`Now press "Skip" to let me know that you don't need this advice, and to get the next one.`)

    return UselessAdvicePrompt.activate({ user, scenario })
  }


})
