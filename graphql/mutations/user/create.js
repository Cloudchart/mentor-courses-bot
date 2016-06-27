import {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import Types from '../../types'

import Stores from '../../../stores'


export default mutationWithClientMutationId({
  name: 'CreateUser',

  inputFields: () => ({

    id        : {
      type: new GraphQLNonNull(GraphQLInt),
    },

    firstName : {
      type: new GraphQLNonNull(GraphQLString),
    },

    lastName  : {
      type: GraphQLString,
    },

    username  : {
      type: GraphQLString,
    },

  }),

  outputFields: () => ({

    user      : {
      type: new GraphQLNonNull(Types.User),
    },

  }),

  mutateAndGetPayload: async ({ id, firstName, lastName, username }) => {
    let user = await Stores.User.create({
      id,
      first_name  : firstName,
      last_name   : lastName,
      username
    })
    return { user }
  }

})
