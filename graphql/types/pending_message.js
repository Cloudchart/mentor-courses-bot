import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'


export default new GraphQLObjectType({

  name: 'PendingMessage',

  fields: () => ({

    id: {
      type: new GraphQLNonNull(GraphQLID)
    },

    sourceID: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ source_id }) => source_id,
    },

    sourceType: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ source_type }) => source_type,
    },

  })

})
