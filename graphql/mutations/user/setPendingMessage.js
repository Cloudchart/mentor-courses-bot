import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay'

import Types from '../../types'

import Stores from '../../../stores'


export default mutationWithClientMutationId({

  name: 'SetPendingMessageToUser',

  inputFields: () => ({

    id: {
      type: new GraphQLNonNull(GraphQLID)
    },

    sourceID: {
      type: new GraphQLNonNull(GraphQLString)
    },

    sourceType: {
      type: new GraphQLNonNull(GraphQLString)
    }

  }),

  outputFields: () => ({

    user: {
      type: new GraphQLNonNull(Types.User)
    },

  }),

  mutateAndGetPayload: async ({ id, sourceID, sourceType }, { viewer }) => {
    await Stores.User.update(viewer, {
      pending_message: { id, source_id: sourceID, source_type: sourceType }
    })

    let user = await Stores.User.load(viewer)

    return { user }
  }

})
