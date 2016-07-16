export default {
  name    : "intro",

  actions : [

    // Await for input
    {
      action    : 'input',
    },

    // Start
    {
      label     : 'start',
      action    : 'message',
      text      : `
        This bot does nothing.
        Yet.
      `
    },

    {
      action    : 'message',
      keyboard  : {
        inline  : true,
        buttons : ['yes', 'no']
      },
      text      : `
        Type *yes* or *no*.
      `
    },

    // Await for input
    {
      label     : 'input',
      action    : 'input',
      branch    : {
        'yes'   : 'input-yes',
        'no'    : 'input-no',
      },
    },

    // Finish and redirect to start
    {
      action    : 'message',
      text      : `
        Just type *yes* or *no*.
      `,
      next      : 'input'
    },

    // Finish and redirect to start
    {
      label     : 'input-yes',
      action    : 'message',
      text      : `
        You've typed *yes*
      `,
      //next      : 'start'
    },

    {
      action    : 'course',
      course    : '53cb75b0-c873-46fe-bdc9-f7290fb8cd62',
      branch    : {
        dropout : 'dropout',
        quit    : 'quit'
      },
    },

    {
      action    : 'message',
      text      : '[[Slip away]] Ok, it is over!',
      next      : 'start'
    },

    {
      label     : 'quit',
      action    : 'message',
      text      : '[[Quit]] As you wish...',
      next      : 'start',
    },

    {
      label     : 'dropout',
      action    : 'message',
      text      : `
        [[Dropout]] Ok, suit yourself.
      `,
      next      : 'start'
    },

    // Finish and redirect to start
    {
      label     : 'input-no',
      action    : 'message',
      text      : `
        You've typed *no*
      `,
      next      : 'start'
    },

  ]
}
