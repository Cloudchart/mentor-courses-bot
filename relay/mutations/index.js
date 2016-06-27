import pingUser from './user/ping'
import createUser from './user/create'
import updateUserScenario from './user/updateScenario'
import subscribeUserToCourse from './user/subscribeToCourse'
import unsubscribeUserFromCourse from './user/unsubscribeFromCourse'
import setPendingMessageToUser from './user/setPendingMessage'
import removeUserPendingMessage from './user/removePendingMessage'

import rateInsight from './insight/rate'

export default {
  pingUser,
  createUser,
  updateUserScenario,
  subscribeUserToCourse,
  unsubscribeUserFromCourse,
  setPendingMessageToUser,
  removeUserPendingMessage,

  rateInsight,
}
