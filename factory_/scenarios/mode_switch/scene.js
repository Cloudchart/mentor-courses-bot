import Scene from '../../Scene'

import CourseChooserScenario from '../course_chooser'
import DailyScenario from '../daily'


const Message = `
  Your training is complete, Human.
  Let's get some real advice!
`

const Buttons = [{
  text      : `Select a course`,
  scenario  : CourseChooserScenario
}, {
  text      : `Continue with daily advice`,
  scenario  : DailyScenario
}]


export default new Scene({

  name: 'Welcome',


  resolveMessage: async (context, next) => {
    let { user, payload: { text } } = context
    let query   = text.trim().toLowerCase()
    let button  = Buttons.find(({ text }) => text.toLowerCase() === query)

    if (button && button.scenario)
      return button.scenario.resolve(context)

    await user.sendMessage(`[[WRONG COMMAND]]`)
    return next()
  },


  resolve: async (context) => {
    let { user } = context

    await user.sendMessage(Message, {
      keyboard: {
        buttons: Buttons.map(({ text }) => [text])
      }
    })
  }


})
