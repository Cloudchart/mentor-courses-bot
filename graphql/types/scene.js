import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'


export default new GraphQLObjectType({

  name: 'Scene',

  fields: () => ({

    name: {
      type: new GraphQLNonNull(GraphQLString)
    },

  })

})
