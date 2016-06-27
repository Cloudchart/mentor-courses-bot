import {
  GraphQLSchema
} from 'graphql'


import Queries from './queries'
import Mutations from './mutations'


export default new GraphQLSchema({

  name: 'Schema',

  query: Queries,
  mutation: Mutations,

})
