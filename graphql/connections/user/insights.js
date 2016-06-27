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


const InsightsFilter = new GraphQLEnumType({

  name: 'UserInsightsFilter',

  values: {
    'RATED'         : { value: 'rated'        },
    'UNRATED'       : { value: 'unrated'      },
    'RANDOM'        : { value: 'random'       },
    'FAKE_USEFUL'   : { value: 'fake_useful'  },
    'FAKE_USELESS'  : { value: 'fake_useless' },
  }

})


const Queries = {
  rated: (user_id) => {
    let user_insights_ids = Stores.User.table.get(user_id)('insights')('id').default([])
    return Stores.Insight.table.filter(insight => {
      return user_insights_ids.contains(insight('id'))
    })
  },

  unrated: (user_id) => {
    let user_insights_ids = Stores.User.table.get(user_id)('insights')('id').default([])
    return Stores.Insight.table.filter(insight => {
      return r.not(user_insights_ids.contains(insight('id')))
    })
  },

  random: (user_id) => {
    return Queries['unrated'](user_id)
  },

  fake_useful: () => {
    return Stores.Insight.table.filter(insight => {
      return insight('id').eq('fake-useful')
    }).limit(1)
  },

  fake_useless: () => {
    return Stores.Insight.table.filter(insight => {
      return insight('id').eq('fake-useless')
    }).limit(1)
  }
}


let UserInsights = null
let UserInsightsConnection = null


let createUserInsights = () => {

  UserInsightsConnection = connectionDefinitions({

    name: 'UserInsights',

    nodeType: Types.Insight,

  })


  UserInsights = {

    type: UserInsightsConnection.connectionType,

    args: {
      ...connectionArgs,
      filter: {
        type: InsightsFilter,
        defaultValue: 'unrated'
      },
    },

    resolve: async (user, { filter, ...args }, { viewer }) => {
      let query = Queries[filter](viewer)

      if (filter === 'random')
        query = query.sample(args.first || args.last || 1)

      let insights = await run(query).then(cursor => cursor.toArray())

      return {
        ...connectionFromArray(insights, args)
      }
    }

  }

}


export default () => {
  if (!UserInsights)
    createUserInsights()

  return UserInsights
}
