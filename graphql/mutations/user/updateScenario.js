import {
  GraphQLString,
  GraphQLNonNull,
} from 'graphql'

import {
  mutationWithClientMutationId
} from 'graphql-relay'

import Types from '../../types'

import Stores from '../../../stores'


export default mutationWithClientMutationId({
  name: 'UpdateUserScenario',

  inputFields: () => ({

    scenarioName  : {
      type: GraphQLString,
    },

    sceneName     : {
      type: GraphQLString,
    },

  }),

  outputFields: () => ({

    user      : {
      type: new GraphQLNonNull(Types.User),
    },

  }),

  mutateAndGetPayload: async ({ scenarioName, sceneName }, { viewer }) => {
    let payload = {
      scenario  : {
        name    : scenarioName,
        scene   : {
          name  : sceneName
        }
      }
    }

    if (!sceneName)
      payload.scenario.scene = null

    if (!scenarioName)
      payload.scenario = null

    let user = await Stores.User.load(viewer)
    if (!user)
      return new Error('Viewer not found.')

    let result = await Stores.User.update(user.id, payload)

    return { user }
  }

})
