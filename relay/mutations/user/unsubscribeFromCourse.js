import Relay from 'react-relay'

export default class extends Relay.Mutation {

  getMutation = () => Relay.QL`
    mutation { unsubscribeUserFromCourse }
  `

  getVariables = () => ({
  })

  getFatQuery = () => Relay.QL`
    fragment on UnsubscribeUserFromCoursePayload {
      user {
        course
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
