import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'

import {
  fromGlobalId
} from 'graphql-relay'

import Types from '../types'

import Stores from '../../stores'


export default new GraphQLObjectType({

  name: 'Queries',

  fields: () => ({

    viewer: {
      type: Types.User,
      resolve: (root, args, { viewer }) => Stores.User.load(viewer)
    },

    insight: {
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      type: Types.Insight,
      resolve: (root, { id }, { viewer }) => Stores.Insight.load(fromGlobalId(id).id)
    }

  })

})
