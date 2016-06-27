import {
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'

import {
  globalIdField,
} from 'graphql-relay'

import Types from '.'

import Stores, { r, run } from '../../stores'


export default new GraphQLObjectType({

  name: 'Insight',

  fields: () => ({

    id: globalIdField(),

    content: {
      type: new GraphQLNonNull(GraphQLString)
    },

    author: {
      type: new GraphQLNonNull(GraphQLString)
    },

    positiveReaction: {
      type: GraphQLString,
      resolve: ({ positive_reaction }) => positive_reaction
    },

    negativeReaction: {
      type: GraphQLString,
      resolve: ({ negative_reaction }) => negative_reaction
    },

    origin: {
      type: new GraphQLNonNull(Types.InsightOrigin)
    },

    rateByViewer: {
      type: GraphQLInt,
      resolve: async ({ id }, args, { viewer }) => {
        let insight = await run (
          Stores.User.table
            .get(viewer)('insights')
            .filter(insight => insight('id').eq(id))
            .limit(1)
        ).then(cursor => cursor.next()).catch(() => ({ rate: 0 }))
        return insight.rate
      }
    }

  })

})
