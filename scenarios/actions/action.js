class Action {

  constructor(config) {
    this.step     = config.step
    this.scenario = config.scenario
    this._config  = config
  }


  nextAction() {
    return this.scenario.actions[this.nextActionIndex()]
  }


  nextActionIndex() {
    let index = null

    if (!this.next)
      this.next = this._config.next

    if (typeof this.next === 'string')
      index = this.scenario.labels[this.next]

    if (index === null || index === undefined)
      index = this.step + 1

    this.next = null

    return index
  }


  async resolve() {
    throw new Error(`Command error: 'resolve' method should not be called from abstract class.`)
  }

}


export default Action
