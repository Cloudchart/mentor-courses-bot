import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () => Relay.QL`
    mutation { setPendingMessageToUser }
  `

  getVariables = () => ({
    id          : this.props.id,
    sourceID    : this.props.sourceID,
    sourceType  : this.props.sourceType,
  })

  getFatQuery = () => Relay.QL`
    fragment on SetPendingMessageToUserPayload {
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
