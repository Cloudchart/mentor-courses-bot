import {
  graphql
} from 'graphql'

import Schema from './schema'


let execute = (request, id) =>
  graphql(
    Schema,
    request.getQueryString(),
    null,
    { viewer: id },
    request.getVariables()
  )
  .then(
    ({ data, errors }) => {
      if (errors)
        request.reject(new Error(errors))
      else
        request.resolve({ response: data })
    }
  )


export {
  execute as query,
  execute as mutation,
}
