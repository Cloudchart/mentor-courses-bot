import {
  GraphQLEnumType
} from 'graphql'

import {
  connectionArgs,
  connectionFromArray,
  connectionDefinitions,
} from 'graphql-relay'

import Types from '../../types'
import Stores, { r, run } from '../../../stores'


let UserCourses = null
let UserCoursesConnection = null


const Queries = {
  all: () =>
    Stores.Course.table,

  active: (user_id) => {
    let active_users_courses_ids = Stores.User.table
      .get(user_id)('courses')('id')
      .default([])

    return Stores.Course.table.filter(course => {
      return active_users_courses_ids.contains(course('id'))
    })
  },

  available: (user_id) => {
    let user_insights_ids = Stores.User.table
      .get(user_id)('insights')('id')
      .default([])

    return Stores.Course.table.filter((course) => {
      return course('insights').filter((id) => {
        return r.not(user_insights_ids.contains(id))
      }).count().gt(0)
    })
  },

  saved: (user_id) => {
    let positive_user_insights_ids = Stores.User.table
      .get(user_id)('insights')
      .filter(insight => insight('rate').eq(1))('id')
      .default([])

    return Stores.Course.table.filter((course) => {
      return course('insights').filter((id) => {
        return positive_user_insights_ids.contains(id)
      }).count().gt(0)
    })
  }

}


const CoursesFilter = new GraphQLEnumType({
  name: 'UserCoursesFilter',

  values: {
    'ALL'       : { value: 'all'        },
    'ACTIVE'    : { value: 'active'     },
    'AVAILABLE' : { value: 'available'  },
    'SAVED'     : { value: 'saved'      },
  }
})


let createUserCourses = () => {
  UserCoursesConnection = connectionDefinitions({

    name: 'UserCourses',

    nodeType: Types.Course

  })

  UserCourses = {
    type: UserCoursesConnection.connectionType,

    args: {
      ...connectionArgs,
      filter: {
        type: CoursesFilter,
        defaultValue: 'all',
      }
    },

    resolve: async (user, { filter, ...args }, { viewer }) => {
      let query = Queries[filter](user.id)
      let courses = await run(query).then(cursor => cursor.toArray())
      return {
        ...connectionFromArray(courses, args)
      }
    },
  }
}


export default () => {

  if (!UserCourses)
    createUserCourses()

  return UserCourses
}
