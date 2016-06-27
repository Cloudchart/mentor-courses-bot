export default [

  {
    label   : 'useless-card-start',
    action  : 'message',
    text    : `
      Some useless advice.
    `,
    keyboard  : {
      once    : true,
      buttons : [['Skip']]
    }
  },

  {
    action    : 'message',
    text      : `Now press or type 'Skip'.`
  },

  {
    action    : 'halt',

    message   : (user, message, next) => {
      let answer = message.trim().toLowerCase()
      if (answer === 'skip') return next('useless-card-done')
      next('useless-card-error')
    },

    next      : 'useless-card-start'
  },

  {
    label     : 'useless-card-error',
    action    : 'message',
    keyboard  : {
      hide    : true
    },
    text      : `
      Oh, come on.
    `,
    next      : 'useless-card-start'
  },

  {
    label     : 'useless-card-done',
    action    : 'message',
    keyboard  : {
      hide    : true
    },
    text      : `
      Ok, you've skipped this card.
    `
  }

]
