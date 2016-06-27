import Scene from '../../Scene'

import DailyScenario from '../daily'
import CourseScenario from '../course'


const fetchCourses = (user) =>
  user.query('courses', { first: 10, filter: 'AVAILABLE' }, true).then(({ courses }) => courses)


const Commands = {
  cancel: async ({ user, scenario }) => {
    await user.sendMessage(`Ok then. Moving to daily slow loop.`)
    return DailyScenario.resolve({ user, scenario })
  }
}


export default new Scene({

  name: 'Scene',


  resolveCommand: async (context, next) => {
    let { user, payload: { command } } = context

    if (Commands[command])
      return Commands[command](context)

    await user.sendMessage(`Unknown command _${command}_.`)
    return next()
  },


  resolveMessage: async (context, next) => {
    let { user, payload: { text } } = context
    let query = text.trim().toLowerCase()
    let courses = await fetchCourses(user)

    let courseEdge = courses.edges.find(({ node }) => node.name.toLowerCase() === query)
    let course = courseEdge && courseEdge.node

    if (!course)
      return next()

    await user.mutation('subscribeUserToCourse', {
      course : course,
      user,
    })

    return CourseScenario.resolve(context)
  },


  resolve: async (context) => {
    let { user, payload } = context

    let courses = await fetchCourses(user)

    if (payload && payload.text)
      await user.sendMessage(`Unknown course "*${payload.text}*".`)

    await user.sendMessage(`What course would you like to start?`, {
      keyboard: {
        one_time_keyboard: true,
        buttons: courses.edges.map(({ node }) => [node.name])
      },
    })
  }


})
