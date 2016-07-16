export default {

  name: '53cb75b0-c873-46fe-bdc9-f7290fb8cd62',

  attributes: {
    course: '53cb75b0-c873-46fe-bdc9-f7290fb8cd62'
  },

  commands: {
    dropout: async (context, next) => {
      let { route } = context
      route.stack = [].concat(route.stack[route.stack.length - 1])
      return next({ payload: { status: 'dropout' } })
    }
  },

  actions: [

    {
      label   : 'start',
      action  : 'message',
      text    : `
        Welcome to course Board by Mark Suster.
      `
    }, {
      action  : 'message',
      text    : `
        Soon...
      `
    }, {
      action  : 'message',
      text    : 'Now type something'
    },

    {
      label   : 'loop',
      action  : 'input',
      branch  : {
        cards   : 'cards',
        quit    : 'quit',
      },
      timeout : {
        duration  : 60 * 1000,
        next      : 'confirm'
      },
      next    : 'start'
    },

    {
      label   : 'cards',
      action  : 'cardList',
      course  : '53cb75b0-c873-46fe-bdc9-f7290fb8cd62',
      next    : 'quit',
    },

    {
      label   : 'confirm',
      action  : 'message',
      text    : `
        I'm waiting...
      `,
      next    : 'loop'
    },

    {
      label   : 'quit',
      action  : 'quit',
    }

  ]

}
