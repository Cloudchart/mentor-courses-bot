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

  name: 'SubscribeUserToCourse',

  inputFields: () => ({

    courseID: {
      type: new GraphQLNonNull(GraphQLID)
    },

  }),

  outputFields: () => ({

    user: {
      type: new GraphQLNonNull(Types.User)
    }

  }),

  mutateAndGetPayload: async ({ courseID }, { viewer }) => {
    await Stores.User.update(viewer, { course: fromGlobalId(courseID).id })
    let user = await Stores.User.load(viewer)
    return { user }
  }

})
