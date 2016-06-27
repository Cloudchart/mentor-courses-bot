import {
  query,
  mutation,
} from '../graphql'


export default function(id) {

  return {
    sendMutation: (mutationRequest) => {
      return mutation(mutationRequest, id)
    },

    sendQueries: (queryRequests) => {
      return Promise.all(queryRequests.map(
        queryRequest => query(queryRequest, id)
      ))
    },

    supports: (...options) => {
      return false
    }
  }

}
