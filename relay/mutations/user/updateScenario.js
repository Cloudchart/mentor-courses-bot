import Relay from 'react-relay'

export default class extends Relay.Mutation {

  static fragments = {
    user: () => Relay.QL`
      fragment on User { id }
    `
  }

  getMutation = () => Relay.QL`
    mutation { updateUserScenario }
  `

  getVariables = () => ({
    scenarioName  : this.props.scenarioName,
    sceneName     : this.props.sceneName,
  })

  getFatQuery = () => Relay.QL`
    fragment on UpdateUserScenarioPayload {
      user {
        scenario
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
