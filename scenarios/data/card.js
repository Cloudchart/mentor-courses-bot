import { r, run } from '../../stores'

export default {

  name: 'card',

  commands: {
    dropout: (context, next) => {
      let { route } = context
      route.stack.reverse().length = 1
      return next({ payload: { status: 'dropout' } })
    }
  },

  actions: [

    {
      label   : 'show-card',
      action  : 'image',
      url     : 'https://s-media-cache-ak0.pinimg.com/236x/5b/11/c6/5b11c6b5eabb728c76b652c330ddaf8e.jpg'
    },

    {
      action  : 'message',
      text    : async (context) => {
        let { card } = context.route.stack[0]
        let insight = await run(r.table('insights').get(card))
        return insight.content
      },
      keyboard: {
        inline : true,
        buttons : ['Skip', 'Save']
      }
    },

    {
      action  : 'input',
      branch  : {
        'save'  : 'save',
        'skip'  : 'skip',
      },
      timeout : {
        duration  : 1000 * 60 * 60,
        next      : 'shall-we',
      }
    },

    {
      action  : 'message',
      text    : `I don't understand`,
      next    : 'show-card'
    },

    {
      label   : 'save',
      action  : 'rateCard',
      status  : 'save'
    },

    {
      action  : 'message',
      text    : `You saved it.`,
      next    : 'quit'
    },

    {
      label   : 'skip',
      action  : 'rateCard',
      status  : 'skip',
    },

    {
      action  : 'message',
      text    : 'You skipped it.',
      next    : 'quit'
    },

    {
      label   : 'shall-we',
      action  : 'message',
      text    : `
        Do you want to quit?
      `,
      keyboard: {
        inline  : true,
        buttons : ['No', 'Yes']
      }
    },

    {
      action  : 'input',
      branch  : {
        'yes' : 'quit',
        'no'  : 'show-card',
      }
    },

    {
      label   : 'quit',
      action  : 'quit',
    }

  ]

}
