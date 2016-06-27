import invariant from 'fbjs/lib/invariant'

import {
  chain
} from '../utils'


import User from '../user'
import Scenario from './scenario'


class Scene {

  constructor(config = {}) {
    invariant(config.name, 'Scene must be named')

    invariant(
      typeof config.resolve === 'function',
      `Scene '${config.name}' must have 'resolve' function.`
    )

    this.name = config.name

    this._resolveFn = config.resolve

    this._config = config
  }

  _resolveTimeout = (context, next) => {
    if (context.payload && context.payload.timeout && this._config.resolveTimeout)
      return this._config.resolveTimeout(context, next)
    else
      return next()
  }

  _resolveCallback = (context, next) => {
    if (context.payload && context.payload.data && this._config.resolveCallback)
      return this._config.resolveCallback(context, next)
    else
      return next()
  }

  resolveCommand = async (context, next) => {
    let { user, payload: { command } } = context

    if (this._config.commands && typeof this._config.commands[command] === 'function')
      return this._config.commands[command](context)

    await user.sendMessage(`Unknown command _${command}_.`)
    return next()
  }

  _resolveCommand = (context, next) => {
    if (context.payload && context.payload.command)
      if (this._config.resolveCommand)
        return this._config.resolveCommand(context, next)
      else
        return this.resolveCommand(context, next)
    else
      return next()
  }

  _resolveMessage = (context, next) => {
    if (context.payload && context.payload.text && this._config.resolveMessage)
      return this._config.resolveMessage(context, next)
    else
      return next()
  }

  resolve = async (context) => {
    this.activate(context)

    let { scenario } = context

    console.log(`Resolving Scene '${this.name}' in Scenario '${scenario.name}'.`)

    return await chain([
      this._resolveTimeout,
      this._resolveCallback,
      this._resolveCommand,
      this._resolveMessage,
      this._resolveFn
    ], context)
  }


  activate = ({ user, scenario }) => {
    invariant(
      scenario instanceof Scenario,
      `Scene '${this.name}' error: 'scenario' should be an instance of 'Scenario' class. Got '${scenario}'.`
    )

    console.log(`Activating Scene '${this.name}' in Scenario '${scenario.name}'.`)

    user.update({
      scenario: {
        scene: {
          name: this.name
        }
      }
    })
  }

}


export default Scene
