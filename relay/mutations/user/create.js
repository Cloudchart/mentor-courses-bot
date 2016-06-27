import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () => Relay.QL`
    mutation { createUser }
  `

  getVariables = () => ({
    id        : this.props.id,
    firstName : this.props.firstName,
    lastName  : this.props.lastName,
    username  : this.props.username
  })

  getFatQuery = () => Relay.QL`
    fragment on CreateUserPayload {
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
