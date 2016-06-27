import Relay from 'react-relay'

export default Relay.QL`
  fragment on Insight {
    id
    author
    content
    origin {
      url
      title
      duration
    }
  }
`
