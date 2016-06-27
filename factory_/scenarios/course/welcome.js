import Scene from '../../Scene'

import CourseChooserScenaro from '../course_chooser'

import Advice from './advice'


export default new Scene({

  name: 'Welcome',


  resolve: async (context) => {
    let { user } = context

    let course = await user.query('viewer', {}, true).then(({ course }) => course)

    if (!course)
      return CourseChooserScenaro.resolve(context)

    await user.sendMessage(`
      Welcome to course based on ${course.author}'s "${course.name}".
    `)

    return await Advice.resolve(context)
  }


})
