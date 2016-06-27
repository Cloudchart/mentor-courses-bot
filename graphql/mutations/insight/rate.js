import {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay'

import Types from '../../types'

import Stores, { r, run } from '../../../stores'


let ratedInsightQuery = (user_id, insight_id) =>
  Stores.User.table
    .get(user_id)('insights')
    .default([])
    .filter(insight => insight('id').eq(insight_id))

let updateUserQuery = (user_id, insight_id, insight_rate) =>
  Stores.User.table
    .get(user_id)
    .update({
      insights: r.row('insights').default([]).append({
        id        : insight_id,
        rate      : insight_rate,
        rated_at  : r.now(),
      })
    })


export default mutationWithClientMutationId({
  name: 'RateInsight',

  inputFields: () => ({

    id: {
      type: new GraphQLNonNull(GraphQLID)
    },

    rate: {
      type: new GraphQLNonNull(GraphQLInt)
    },

  }),

  outputFields: () => ({
    insight: {
      type: new GraphQLNonNull(Types.Insight)
    },

    user: {
      type: new GraphQLNonNull(Types.User)
    },
  }),

  mutateAndGetPayload: async ({ id, rate }, { viewer }) => {
    let insight = await Stores.Insight.load(fromGlobalId(id).id)
    if (!insight)
      return new Error('Insight not found')

    let ratedInsight = await run(ratedInsightQuery(viewer, insight.id)).then(cursor => cursor.next()).catch(() => null)
    if (ratedInsight)
      return new Error('Insight already rated')

    await run(updateUserQuery(viewer, insight.id, rate))

    insight = await run(Stores.Insight.table.get(insight.id))
    let user = await run(Stores.User.table.get(viewer))

    return { insight, user }
  }

})
