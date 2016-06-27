import Scene from '../../Scene'

import UsefulAdviceScene from './useful'


export default new Scene({

  name: 'Welcome',

  resolve: async ({ user, scenario }) => {
    await user.sendMessage('Welcome, human!')
    await user.sendMessage('Let me show how it works.')
    return UsefulAdviceScene.resolve({ user, scenario })
  }

})
