import Relay from 'react-relay'
import Queries from './queries'
import Mutations from './mutations'
import LocalNetworkLayer from './LocalNetworkLayer'

let cachedEnvironments = {}

let getEnvironment = (key) => {
  if (!cachedEnvironments[key]) {
    cachedEnvironments[key] = new Relay.Environment()
    cachedEnvironments[key].injectNetworkLayer(LocalNetworkLayer(key))
  }
  return cachedEnvironments[key]
}

let mutation = (key, mutationName, variables = {}) => {
  let environment = getEnvironment(key)
  let mutation = new Mutations[mutationName](variables)
  return new Promise((resolve, reject) => {
    environment.commitUpdate(mutation, {
      onSuccess: (response) => {
        resolve(response)
      },
      onFailure: (transaction) => {
        reject(transaction.getError())
      }
    })
  })
}


let primeCache = (environment, query) =>
  new Promise(
    (resolve, reject) =>
      environment.primeCache({ [query.getName()] : query }, onReadyStateChange(environment, query, resolve, reject))
  )


let forceFetch = (environment, query) =>
  new Promise(
    (resolve, reject) =>
      environment.forceFetch({ [query.getName()] : query }, onReadyStateChange(environment, query, resolve, reject))
  )


let onReadyStateChange = (environment, query, resolve, reject) =>
  (readyState) =>
    readyState.done ? resolve(environment.readQuery(query)[0]) : null


let query = (key, queryName, variables = {}, force = false) => {
  let environment = getEnvironment(key)
  let query = Relay.createQuery(Queries[queryName], variables)
  return force
    ? forceFetch(environment, query)
    : primeCache(environment, query)
}


let clear = (key) =>
  cachedEnvironments[key] = null


export default {
  mutation,
  query,
  clear,
}
