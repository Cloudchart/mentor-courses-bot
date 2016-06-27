import Scenario from '../../scenario'

import Welcome from './welcome'
import Advice from './advice'
import Outro from './outro'


export default new Scenario({

  name: 'Course',

  scenes: [
    Welcome,
    Advice,
    Outro,
  ]

})
