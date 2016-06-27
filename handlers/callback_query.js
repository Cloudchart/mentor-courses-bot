import Factory from '../factory'


let resolve = (callback_query) => {
  Factory.resolve({
    type        : 'callback_query',
    from        : callback_query.from,
    message     : callback_query.message,
    data        : callback_query.data,
  })
}


export default {
  resolve
}
