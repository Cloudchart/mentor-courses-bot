import Relay from 'react-relay'

import Mutations from '../mutations'

export default Relay.QL`
  query {
    insight(id: $id) {
      id
      author
      content
      origin {
        url
        title
        duration
      }
      rateByViewer
    }
  }
`
