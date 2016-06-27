import {
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'

import {
  globalIdField,
} from 'graphql-relay'

import Types from '.'

import {
  UserCoursesConnection,
  UserInsightsConnection,
} from '../connections'

import Stores from '../../stores'


export default new GraphQLObjectType({

  name: 'User',

  fields: () => ({

    id: globalIdField(),

    firstName: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ first_name }) => first_name,
    },

    lastName: {
      type: GraphQLString,
      resolve: ({ last_name }) => last_name,
    },

    username: {
      type: GraphQLString,
    },

    scenario: {
      type: Types.Scenario,
    },

    lastPingAt: {
      type: GraphQLInt,
      resolve: ({ last_ping_at }) => last_ping_at
    },

    course: {
      type: Types.Course,
      resolve: ({ course }) => course && Stores.Course.load(course)
    },

    courses: UserCoursesConnection(),

    insights: UserInsightsConnection(),

    pendingMessage: {
      type: Types.PendingMessage,
      resolve: ({ pending_message }) => pending_message
    }

  })

})
