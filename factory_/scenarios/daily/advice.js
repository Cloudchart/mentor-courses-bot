import Scene from '../../Scene'

import MainScene from './main'

import {
  insightText,
  insightButtons,
} from '../../../utils'


let fetchInsight = (user) =>
  user.query('insights', { first: 1, filter: 'RANDOM' }, true)
    .then(({ insights }) => insights.edges && insights.edges.map(({ node }) => node))
    .then(nodes => nodes[0])


export default new Scene({

  name: 'Advice',


  resolve: async (context) => {
    let { user } = context
    let insight = await fetchInsight(user)

    if (!insight)
      return await user.sendMessage(`No more advice for you.`)

    let message = await user.sendMessage(insightText(insight), {
      keyboard: {
        inline  : true,
        buttons : insightButtons(insight)
      }
    })

    await user.mutation('setPendingMessageToUser', {
      id          : message.message_id,
      sourceID    : insight.id,
      sourceType  : 'Insight',
      user
    })
  }


})
