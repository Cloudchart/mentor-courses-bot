import {
  GraphQLNonNull
} from 'graphql'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import Types from '../../types'

import Stores from '../../../stores'


export default mutationWithClientMutationId({
  name: 'PingUser',

  outputFields: () => ({

    user : {
      type: new GraphQLNonNull(Types.User),
    },

  }),

  mutateAndGetPayload: async (args, { viewer }) => {
    await Stores.User.update(viewer, { last_ping_at: Stores.r.now() })
    let user = await Stores.User.load(viewer)
    return { user }
  }

})
