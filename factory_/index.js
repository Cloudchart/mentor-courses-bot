import invariant from 'fbjs/lib/invariant'

import User from '../user'
import Scenarios from './scenarios'


const DefaultScenario = Scenarios.Intro


let Queues = {}


class Factory {

  constructor(config = {}) {
    this._config = config
  }


  findScenario = (scenarioName) =>
    Scenarios[scenarioName] || DefaultScenario


  resolve = async (payload) => {
    let user = await User.ensure(payload.from.id, payload.from)
    user.resolvePendingMessage()

    Queues[user.id] = new Promise(async (resolve, reject) => {
      try {

        await Promise.resolve(Queues[user.id])

        let scenario = this.findScenario(user.get('scenario.name'))
        await scenario.resolve({ user, payload })

        resolve()

      } catch(error) {

        console.error(error)

        reject(error)

      } finally {
        await user.finalize()
      }
    })

  }

}


export default new Factory({

  scenarios: Scenarios

})
