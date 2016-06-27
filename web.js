import express from 'express'
import graphqlHTTP from 'express-graphql'

import Schema from './graphql/schema'


const app = express()


app.use('/graphql', graphqlHTTP(request => {
  return {
    schema    : Schema,
    context   : {
      viewer  : 116157
    },
    graphiql  : true,
  }
}))


app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port', process.env.PORT || 3000)
})
