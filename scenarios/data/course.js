import Stores, { r, run } from '../../stores'


let currentCourse = (user) => {
  return run(
    Stores.Course.table.get(Stores.User.table.get(user.id)('course'))
  ).catch(error => null)
}


let availableCourses = (user) => {
  let user_insights = Stores.User.table.get(user.id)('insights')('id').default([])
  return run(
    Stores.Course.table.filter(course => {
      return course('insights').filter(insight => {
        return r.not(user_insights.contains(insight))
      }).count().gt(0)
    })
  ).then(cursor => cursor.toArray())
}


let buttonsForCourseChooser = async (user) => {
  let courses = await availableCourses(user)
  return courses.map(course => [course.name])
}


export default [
  {
    label     : "course",
    action    : "message",
    text      : `
      Let's start a course!
    `,
  }, {
    label     : "course-chooser",
    action    : "message",
    text      : "Choose a course:",
    keyboard  : {
      once    : true,
      buttons : buttonsForCourseChooser,
    }
  }, {
    action    : "halt",

    commands  : {
      cancel  : {
        label   : "course-drop-out",
      }
    },

    message   : async (user, message, next) => {
      let query   = message.trim().toLowerCase()
      let courses = await availableCourses(user)
      let course  = courses.find(course => course.name.toLowerCase() === query)

      if (course)
        await run(Stores.User.table.get(user.id).update({ course: course.id }))

      next()
    }
  }, {
    action    : "fork",
    resolve   : async (user) => {
      let course = await currentCourse(user)
      return course ? 'ok' : 'not_found'
    },
    forks     : {
      ok        : 'course-start',
      not_found : 'unknown-course',
    }
  },{
    label     : "unknown-course",
    action    : "message",
    text      : `Course not found.`,
    next      : "course-chooser",
  }, {
    label     : "course-start",
    action    : "message",
    text      : async (user) => {
      let course = await currentCourse(user)
      return `Starting course based on _${course.name} by ${course.author}_.`
    },
    keyboard  : {
      hide    : true
    },
    next      : "card-main-loop"
  },


  // Drop out from course
  {
    label     : "course-drop-out",
    action    : "message",
    text      : "Ok, dropping out to core loop.",
    keyboard  : {
      hide    : true,
    },
    resolve   : async (user) => {
      await run(Stores.User.table.get(user.id).replace(user => user.without('course', 'insight')))
    },
    next      : "core-loop"
  }
]
