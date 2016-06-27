import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'


import Types from '.'


export default new GraphQLObjectType({

  name: 'Scenario',

  fields: () => ({

    name: {
      type: new GraphQLNonNull(GraphQLString)
    },

    scene: {
      type: Types.Scene,
    },

  })

})
