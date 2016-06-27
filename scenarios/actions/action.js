class Action {

  constructor(config) {
    this.next = config.next
  }

  resolve() {
    throw new Error(`Command error: 'resolve' method should not be called from abstract class.`)
  }

}


export default Action
