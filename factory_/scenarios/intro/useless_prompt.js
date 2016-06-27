import Scene from '../../Scene'

import ModeSwitchScenario from '../mode_switch'
import UselessAdviceScene from './useless'

import {
  resolveCallback,
} from '../../../utils'


export default new Scene({

  name: 'UselessAdvicePrompt',

  resolveCallback: async (context, next) => {
    let { user, payload } = context

    await resolveCallback(user, payload).catch(() => null)
    await user.sendMessage(`Ok, you skipped it.`)
    return ModeSwitchScenario.resolve(context)
  },


  resolve: async ({ user, scenario }) => {
    await user.sendMessage(`Oh come on!`)
    return UselessAdviceScene.resolve({ user, scenario })
  }


})
