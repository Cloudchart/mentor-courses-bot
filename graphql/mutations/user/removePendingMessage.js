import {
  GraphQLNonNull,
} from 'graphql'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import Types from '../../types'

import Stores from '../../../stores'


export default mutationWithClientMutationId({

  name: 'RemoveUserPendingMessage',

  outputFields: () => ({

    user: {
      type: new GraphQLNonNull(Types.User)
    },

  }),

  mutateAndGetPayload: async (args, { viewer }) => {
    await Stores.User.update(viewer, { pending_message: null })

    let user = await Stores.User.load(viewer)

    return { user }
  }

})
