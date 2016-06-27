import invariant from 'fbjs/lib/invariant'

import User from '../user'
import Scene from './scene'


let arrayOrFn = (value) => typeof value === 'function' ? value() : value


class Scenario {


  constructor(config = {}) {
    invariant(config.name, 'Scenario must be named.')

    this.name = config.name
    this._config = config
  }


  scenes = () => {
    if (!this._scenes) {
      let scenes = arrayOrFn(this._config.scenes)
      invariant(
        scenes && Array.isArray(scenes) && scenes.length > 0,
        `Scenario '${this.name}' error: 'scenes' should be an array or function returning array of 'Scene' objects.`
      )
      this._scenes = scenes.reduce((memo, scene) => {
        invariant(
          scene instanceof Scene,
          `Scenario '${this.name}' error: 'scenes' should be an array or function returning array of 'Scene' objects.`
        )
        memo[scene.name] = scene
        return memo
      }, {})
      this._defaultScene = scenes[0]
    }
    return this._scenes
  }


  findScene = (sceneName) =>
    this.scenes()[sceneName] || this._defaultScene


  resolve = async ({ user, payload }) => {
    this.activate({ user })

    console.log(`Resolving Scenario '${this.name}'.`)

    let scene = this.findScene(user.get('scenario.scene.name'))
    return await scene.resolve({ user, payload, scenario: this })
  }


  activate = ({ user }) => {
    console.log(`Activating Scenario '${this.name}'.`)

    user.update({
      scenario: {
        name: this.name
      }
    })
  }


  finish = ({ user }) => {
    console.log(`Finishing Scenario '${this.name}'.`)

    user.update({ scenario: null })
  }


}


export default Scenario
