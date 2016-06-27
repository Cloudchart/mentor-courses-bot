import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () => Relay.QL`
    mutation { pingUser }
  `

  getVariables = () => ({
  })

  getFatQuery = () => Relay.QL`
    fragment on PingUserPayload {
      user
    }
  `

  getConfigs = () => [{
    type      : 'FIELDS_CHANGE',
    fieldIDs  : {
      user    : this.props.id,
    }
  }]

}
