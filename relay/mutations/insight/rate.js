import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () => Relay.QL`
    mutation { rateInsight }
  `

  getVariables = () => ({
    id        : this.props.insight.id,
    rate      : this.props.rate,
  })

  getFatQuery = () => Relay.QL`
    fragment on RateInsightPayload {
      user {
        insights
      }
      insight
    }
  `

  getConfigs = () => [{
    type      : 'FIELDS_CHANGE',
    fieldIDs  : {
      user    : this.props.user.id,
      insight : this.props.insight.id
    }
  }]

}
