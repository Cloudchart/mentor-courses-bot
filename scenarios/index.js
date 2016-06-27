import fs from 'fs'
import path from 'path'

import Scenario from './scenario'


let loadedScenarios = {}


let loadScenario = (name) => {
  if (!loadedScenarios[name]) {
    console.log('loading scenario')
    // let data = fs.readFileSync(path.join(__dirname, name + '.json'), { encoding: 'utf-8' })
    // loadedScenarios[name] = new Scenario(JSON.parse(data))
    loadedScenarios[name] = new Scenario(require(path.join(__dirname, 'data', name)).default)
  }
  return loadedScenarios[name]
}


let resolve = async (name, index, { user, ...payload }) => {
  let scenario = loadScenario(name)
  return scenario.resolve(user, index, payload)
}


export {
  resolve
}
