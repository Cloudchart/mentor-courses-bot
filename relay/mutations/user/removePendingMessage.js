import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () => Relay.QL`
    mutation { removeUserPendingMessage }
  `

  getVariables = () => ({
  })

  getFatQuery = () => Relay.QL`
    fragment on RemoveUserPendingMessagePayload {
      user {
        pendingMessage
      }
    }
  `

  getConfigs = () => [{
    type      : 'FIELDS_CHANGE',
    fieldIDs  : {
      user    : this.props.user.id,
    }
  }]

}
