import Scene from '../../Scene'

import UsefulAdviceScene from './useful'
import UselessAdviceScene from './useless'

import {
  resolveCallback,
} from '../../../utils'


export default new Scene({

  name: 'UsefulAdvicePrompt',

  resolveCallback: async (context, next) => {
    let { user, payload } = context

    await resolveCallback(user, payload).catch(() => null)
    await user.sendMessage(`Good job! The advice is in your collection now.`)
    return UselessAdviceScene.resolve(context)
  },


  resolve: async ({ user, scenario }) => {
    await user.sendMessage(`Oh come on!`)
    return UsefulAdviceScene.resolve({ user, scenario })
  }


})
