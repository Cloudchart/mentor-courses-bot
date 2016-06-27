import Scene from '../../Scene'

import CourseScenario from '../course'
import AdviceScene from './advice'

import {
  resolveCallback,
} from '../../../utils'


export default new Scene({

  name: 'Main',


  commands: {
    course: ({ user, scenario }) =>
      CourseScenario.resolve({ user, scenario }),

    advice: ({ user, scenario }) =>
      AdviceScene.resolve({ user, scenario })
  },


  resolveCallback: async (context, next) => {
    let { user, payload } = context
    await resolveCallback(user, payload)
    await user.sendMessage(`Got it.`)
  },


  resolveMessage: async (context, next) => {
    let { user } = context
    await user.sendMessage(`Say what?`)
    return next()
  },


  resolve: async (context) => {
  }


})
