import Relay from 'react-relay'

import Mutations from '../mutations'
import InsightFragment from './fragments/insight'


export default Relay.QL`
  query {
    viewer {
      insights(first: $first, filter: $filter) {
        edges {
          node {
            ${InsightFragment}
          }
        }
      }
    }
  }
`
