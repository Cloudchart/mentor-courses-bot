import Relay from 'react-relay'

import Mutations from '../mutations'


export default Relay.QL`
  query {
    viewer {
      courses(first: $first, filter: $filter) {
        edges {
          node {
            id
            name
            author
          }
        }
      }
    }
  }
`
