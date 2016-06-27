import Relay from 'react-relay'

import Mutations from '../mutations'


export default Relay.QL`
  query {
    viewer {
      course {
        name
        insights(first: $first, filter: $filter) {
          totalCount
          positiveCount
          edges {
            node {
              id
              author
              content
              origin {
                url
                title
                duration
              }
            }
          }
        }
      }
    }
  }
`
