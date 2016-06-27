import Scene from '../../Scene'

import CourseChooserScenario from '../course_chooser'
import DailyScenario from '../daily'
import Welcome from './welcome'


let Prompt = new Scene({

  name: 'Prompt',

  resolve: async (context) => {
    let { user, payload } = context

    switch (payload.text) {
      case 'Select a course':
        return await CourseChooserScenario.resolve(context)
        break
      case 'Continue with daily advice':
        await user.sendMessage('Ok, continuing with daily advice.')
        return await DailyScenario.resolve(context)
        break
      default:
        await user.sendMessage('WTF?')
        return await Welcome.resolve(context)
        break
    }

  }

})


export default Prompt
