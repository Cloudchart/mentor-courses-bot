import {
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'


export default new GraphQLObjectType({

  name: 'InsightOrigin',

  fields: () => ({

    duration: {
      type: GraphQLInt,
    },

    author: {
      type: new GraphQLNonNull(GraphQLString)
    },

    title: {
      type: GraphQLString,
    },

    url: {
      type: GraphQLString,
    },

  })

})
