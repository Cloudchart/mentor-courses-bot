import invariant from 'fbjs/lib/invariant'

import Actions from './actions'


let create = ({ action, ...config }) => {
  invariant(action, `Command error: 'action' field should be defined.`)
  invariant(Actions[action], `Command error: '${action}' action is undefined.`)
  return new Actions[action](config)
}


export default {
  create
}
