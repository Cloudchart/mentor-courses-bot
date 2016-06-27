import Stores, { run } from '../../stores'

import UsefulCardScenario from './useful_card'
import UselessCardScenario from './useless_card'
import CourseScenario from './course'
import CardScenario from './card'


let restart = async (user) => {
  await run(
    Stores.User.table.get(user.id).replace(user => {
      return user.without('routes', 'insights', 'course')
    })
  )
}


export default {
  name    : "main",

  actions : [

    // Start
    {
      label   : "start",
      action  : "message",
      text    : "Welcome",
    }, {
      action  : "message",
      text    : "Intro",
    },

    ...UsefulCardScenario,
    ...UselessCardScenario,

    {
      label   : "core-loop",
      action  : "message",
      text    : `
        Let's play!
        You can type /course to start a course.
        You can type /start to restart.
      `
    }, {
      label     : "core-halt",
      action    : "halt",
      commands  : {
        start   : {
          label   : "start",
          resolve : restart
        },
        course  : {
          label : "course"
        }
      }
    }, {
      action    : "message",
      text      : "Say what?",
      next      : "core-loop",
    },

    // Course
    ...CourseScenario,

    // Card
    ...CardScenario,

  ]

}
