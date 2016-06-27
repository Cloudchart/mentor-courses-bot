import Scene from '../../Scene'

import DailyScenario from '../daily'


const Message = (course) => `
  Hourray, that was the last advice in the course!
  I've saved all advice you wanted to use in "${course.name}".
  You saved ${course.insights.positiveCount} out of ${course.insights.totalCount} advice from this course, so put it to good use.
`

export default new Scene({

  name: 'Outro',

  resolve: async (context) => {
    let { user } = context
    let course = await user.query('courseInsights', { first: 1, filter: 'ALL' }, true)
      .then(({ course }) => course)

    if (course) {
      await user.mutation('unsubscribeUserFromCourse', { user })
      await user.sendMessage(Message(course))
    }

    return await DailyScenario.resolve(context)
  }

})
