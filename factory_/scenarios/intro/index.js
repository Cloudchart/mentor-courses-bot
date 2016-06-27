import Scenario from '../../scenario'

import WelcomeScene from './welcome'
import UsefulAdvicePrompt from './useful_prompt'
import UselessAdvicePrompt from './useless_prompt'


export default new Scenario({

  name: 'Intro',

  scenes: [
    WelcomeScene,
    UsefulAdvicePrompt,
    UselessAdvicePrompt,
  ]

})
