import {
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql'

import {
  globalIdField,
} from 'graphql-relay'

import {
  CourseInsightsConnection,
} from '../connections'

import Stores, { r, run} from '../../stores'


export default new GraphQLObjectType({

  name: 'Course',

  fields: () => ({

    id: globalIdField(),

    name: {
      type: new GraphQLNonNull(GraphQLString)
    },

    author: {
      type: new GraphQLNonNull(GraphQLString)
    },

    isAvailableForViewer: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: async (course, args, { viewer }) => {
        let userInsightsIDs = Stores.User.table.get(viewer)('insights')('id').default([])
        let query = Stores.Course.table.get(course.id)('insights').filter(
          insight => {
            return r.not(userInsightsIDs.contains(insight))
          }
        ).count()
        return await run(query) > 0
      }
    },

    insights: CourseInsightsConnection(),

  })

})
