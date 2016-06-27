import {
  GraphQLObjectType
} from 'graphql'

import PingUserMutation from './user/ping'
import CreateUserMutation from './user/create'
import UpdateUserScenarioMutation from './user/updateScenario'
import SubscribeUserToCourseMutation from './user/subscribeToCourse'
import UnsubscribeUserFromCourseMutation from './user/unsubscribeFromCourse'
import SetPendingMessageToUserMutation from './user/setPendingMessage'
import RemoveUserPendingMessageMutation from './user/removePendingMessage'

import RateInsightMutation from './insight/rate'


export default new GraphQLObjectType({

  name: 'Mutations',

  fields: () => ({

    pingUser                  : PingUserMutation,
    createUser                : CreateUserMutation,
    updateUserScenario        : UpdateUserScenarioMutation,
    subscribeUserToCourse     : SubscribeUserToCourseMutation,
    unsubscribeUserFromCourse : UnsubscribeUserFromCourseMutation,
    setPendingMessageToUser   : SetPendingMessageToUserMutation,
    removeUserPendingMessage  : RemoveUserPendingMessageMutation,

    rateInsight               : RateInsightMutation,

  })

})
