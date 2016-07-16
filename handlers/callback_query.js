import Factory from '../factory'


let resolve = (bot, { callback_query }) => {
  Factory.resolve(bot, {
    type        : 'callback_query',
    id          : callback_query.id,
    from        : callback_query.from,
    message     : callback_query.message,
    data        : callback_query.data,
  })
}


export default {
  resolve
}
