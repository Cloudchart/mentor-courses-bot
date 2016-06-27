export default [

  {
    label   : 'useful-card-start',
    action  : 'message',
    text    : `
      Some useful advice.
    `,
    keyboard  : {
      once    : true,
      buttons : [['Save']]
    }
  },

  {
    action    : 'message',
    text      : `Now press or type 'Save'.`
  },

  {
    action    : 'halt',

    message   : (user, message, next) => {
      let answer = message.trim().toLowerCase()
      if (answer === 'save') return next('useful-card-done')
      next('useful-card-error')
    },

    next      : 'useful-card-start'
  },

  {
    label     : 'useful-card-error',
    action    : 'message',
    keyboard  : {
      hide    : true
    },
    text      : `
      Oh, come on.
    `,
    next      : 'useful-card-start'
  },

  {
    label     : 'useful-card-done',
    action    : 'message',
    keyboard  : {
      hide    : true
    },
    text      : `
      Ok, you've saved this card.
    `
  }

]
