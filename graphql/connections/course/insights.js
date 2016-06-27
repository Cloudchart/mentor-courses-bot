import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLEnumType,
} from 'graphql'

import {
  connectionArgs,
  connectionFromArray,
  connectionDefinitions,
} from 'graphql-relay'

import Types from '../../types'
import Stores, { r, run } from '../../../stores'


let CourseInsights = null
let CourseInsightsConnection = null


const userInsights = (user_id) =>
  Stores.User.table.get(user_id)('insights')

const positiveUserInsights = (user_id) =>
  userInsights(user_id).filter(insight => insight('rate').gt(0))

const negativeUserInsights = (user_id) =>
  userInsights(user_id).filter(insight => insight('rate').lt(0))

const courseInsights = (course_id) => {
  let course_insights_ids = Stores.Course.table.get(course_id)('insights')
  return Stores.Insight.table.filter(insight => course_insights_ids.contains(insight('id')))
}


const Queries = {
  all: ({ course_id }) => {
    return courseInsights(course_id)
  },

  rated: ({ course_id, user_id }) => {
    let rated_user_insights_ids = userInsights(user_id)('id').default([])
    return courseInsights(course_id)
      .filter(insight => rated_user_insights_ids.contains(insight('id')))
  },

  unrated: ({ course_id, user_id }) => {
    let rated_user_insights_ids = userInsights(user_id)('id').default([])
    return courseInsights(course_id)
      .filter(insight => r.not(rated_user_insights_ids.contains(insight('id'))))
  },

  positive: ({ course_id, user_id }) => {
    let positive_user_insights_ids = positiveUserInsights(user_id)('id').default([])
    return courseInsights(course_id)
      .filter(insight => positive_user_insights_ids.contains(insight('id')))
  },

  negative: ({ course_id, user_id }) => {
    let negative_user_insights_ids = negativeUserInsights(user_id)('id').default([])
    return courseInsights(course_id)
      .filter(insight => negative_user_insights_ids.contains(insight('id')))
  },
}


const InsightsFilter = new GraphQLEnumType({

  name: 'CourseInsightsFilter',

  values: {
    'ALL'       : { value: 'all'      },
    'RATED'     : { value: 'rated'    },
    'UNRATED'   : { value: 'unrated'  },
    'POSITIVE'  : { value: 'positive' },
    'NEGATIVE'  : { value: 'negative' },
  }

})


let createCourseInsights = () => {

  CourseInsightsConnection = connectionDefinitions({

    name: 'CourseInsights',

    nodeType: Types.Insight,

    connectionFields: () => ({

      positiveCount: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve: ({ course_id, user_id }) =>
          run(Queries['positive']({ course_id, user_id }).count())
      },

      negativeCount: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve: ({ course_id, user_id }) =>
          run(Queries['negative']({ course_id, user_id }).count())
      },

      totalCount: {
        type: new GraphQLNonNull(GraphQLInt),
        resolve: ({ course_id }) =>
          run(Queries['all']({ course_id }).count())
      }

    })

  })


  CourseInsights = {

    type: CourseInsightsConnection.connectionType,

    args: {
      ...connectionArgs,
      filter: {
        type: InsightsFilter,
        defaultValue: 'all'
      }
    },

    resolve: async (course, { filter, ...args }, { viewer }) => {
      let insights = await run(Queries[filter]({
        course_id : course.id,
        user_id   : viewer,
      })).then(cursor => cursor.toArray())

      return {
        ...connectionFromArray(insights, args),
        course_id : course.id,
        user_id   : viewer,
      }
    }

  }

}


export default () => {
  if (!CourseInsights)
    createCourseInsights()

  return CourseInsights
}
