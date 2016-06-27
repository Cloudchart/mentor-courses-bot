import r from 'rethinkdb'

let connection = null

let connect = async () => {
  if (!connection) {
    connection = await r.connect({
      host      : 'localhost',
      port      : '28015',
      db        : 'courses',
      user      : 'admin',
      password  : ''
    })
  }
  return connection
}


let run = async (query) => query.run(await connect())

export default r

export {
  run,
}
