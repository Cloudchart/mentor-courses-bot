import Relay from 'react-relay'

import Mutations from '../mutations'


const UserFragment = Relay.QL`
  fragment on User {
    ${Mutations.updateUserScenario.getFragment('user')}
    firstName
    lastName
    username
    course {
      id
      name
      author
    }
    scenario {
      name
      scene {
        name
      }
    }
  }
`


export default Relay.QL`
  query {
    viewer {
      ${UserFragment}
    }
  }
`
