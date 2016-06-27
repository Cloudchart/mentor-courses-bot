import Relay from 'react-relay'

import Mutations from '../mutations'


export default Relay.QL`
  query {
    viewer {
      pendingMessage {
        id
        sourceID
        sourceType
      }
    }
  }
`
