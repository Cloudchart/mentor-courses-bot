import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () => Relay.QL`
    mutation { subscribeUserToCourse }
  `

  getVariables = () => ({
    courseID: this.props.course.id
  })

  getFatQuery = () => Relay.QL`
    fragment on SubscribeUserToCoursePayload {
      user
    }
  `

  getConfigs = () => [{
    type      : 'FIELDS_CHANGE',
    fieldIDs  : {
      user    : this.props.user.id,
    }
  }]

}
