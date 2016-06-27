import Stores, { r, run } from '../../stores'


let nextInsight = async (user) => {
  let courseID = Stores.User.table.get(user.id)('course')
  let user_insights = Stores.User.table.get(user.id)('insights')('id').default([])
  let course_insights = Stores.Course.table.get(courseID)('insights').default([])

  return run(
    Stores.Insight.table.filter(insight => {
      let insightID = insight('id')
      return course_insights.contains(insightID).and(r.not(user_insights.contains(insightID)))
    }).limit(1)
  ).then(cursor => cursor.next())
}


let rateInsight = async (user, rate) =>
  await run(
    Stores.User.table.get(user.id)
      .update({
        insights: r.row('insights').default([]).append({
          id    : r.row('insight'),
          rate  : rate
        }),
        insight : null
      })
  )


let currentCourse = (user) =>
  run(Stores.Course.table.get(Stores.User.table.get(user.id)('course')))


let currentInsight = (user) =>
  run(Stores.Insight.table.get(Stores.User.table.get(user.id)('insight')))


export default [
  // Load next card
  {
    label     : "card-main-loop",
    action    : "fork",
    resolve   : async (user) => {
      let insight = await nextInsight(user).catch(error => null)
      if (insight)
        await run(
          Stores.User.table.get(user.id).update({ insight: insight.id })
        )
      return insight ? "ok" : "no_more"
    },
    forks: {
      ok      : "show-card",
      no_more : "no-more-cards",
    }
  },

  // Render card
  {
    label     : "show-card",
    action    : "message",
    text      : async (user) => {
      let insight = await currentInsight(user)
      return insight.content
    },
    keyboard  : {
      once    : true,
      buttons : [['Skip', 'Save']],
    }
  },

  // Wait for user answer
  {
    action    : "halt",

    // commands
    commands  : {
      dropout : {
        label   : 'course-drop-out',
      },
      help    : {
        label   : 'card-help'
      }
    },

    // message
    message   : async (user, message, next) => {
      let answer = message.trim().toLowerCase()

      if (answer === 'skip') return next('card-skip')
      if (answer === 'save') return next('card-save')

      next('card-unknown-answer')
    },

    next      : "show-card",
  },

  // Unknown answer
  {
    label     : "card-unknown-answer",
    action    : "message",
    text      : `I don't understand.`,
    next      : "show-card",
  },

  // Card skip
  {
    label     : 'card-skip',
    action    : 'message',
    text      : `Ok, you've skipped it.`,
    next      : 'card-main-loop',
    resolve   : async (user) => await rateInsight(user, -1)
  },

  // Card save
  {
    label     : 'card-save',
    action    : 'message',
    text      : `Ok, you've saved it.`,
    next      : 'card-main-loop',
    resolve   : async (user) => await rateInsight(user, +1)
  },

  // No more cards, returning to core loop
  {
    label     : "no-more-cards",
    action    : "message",
    text      : `Great! You've completed this course.`,
    next      : "core-loop",
  },

  {
    label     : 'card-help',
    action    : 'message',
    text      : `
      You can save or skip card.
      You can type /dropout to return to core loop.
    `,
    keyboard  : {
      hide    : true
    },
    next      : 'show-card'
  }
]
