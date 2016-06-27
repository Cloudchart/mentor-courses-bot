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

import Stores, { run } from '../../../stores'


export default mutationWithClientMutationId({

  name: 'UnsubscribeUserFromCourse',

  outputFields: () => ({

    user: {
      type: new GraphQLNonNull(Types.User)
    }

  }),

  mutateAndGetPayload: async (args, { viewer }) => {
    await run(Stores.User.table.get(viewer).update({ course: null }))
    let user = await run(Stores.User.table.get(viewer))
    return { user }
  }

})
