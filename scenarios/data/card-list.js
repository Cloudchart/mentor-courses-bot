export default {

  name: 'card-list',


  actions: [

    {
      action  : 'message',
      text    : 'Starting card list',
    },

    {
      label   : 'start',
      action  : 'fetchCard',
      branch  : {
        empty : 'quit'
      }
    },

    {
      action  : 'card',
      next    : 'start'
    },

    {
      label   : 'quit',
      action  : 'message',
      text    : 'Exiting card list'
    },

    {
      action  : 'quit'
    }

  ]

}
