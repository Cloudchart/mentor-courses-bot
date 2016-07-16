import { r, run } from '../stores'

const Table = r.table('user_bot_routes')


let findRoute = (user_id, bot_id) =>
  run(
    Table.getAll([user_id, bot_id], { index: 'user_bot' }).limit(1)
  ).then(cursor => cursor.next()).catch(error => null)


async function createRoute(user_id, bot_id) {
  await run(
    Table.insert({ user_id, bot_id, stack: [] })
  )
  return findRoute(user_id, bot_id)
}


async function replaceRoute(route) {
  await run(
    Table.get(route.id).replace(route)
  )
  return findRoute(route.user_id, route.bot_id)
}


async function findOrCreateRoute (user_id, bot_id) {
  let route = await findRoute(user_id, bot_id)
  if (!route) route = await createRoute(user_id, bot_id)
  return route
}


export default {
  findRoute,
  createRoute,
  replaceRoute,
  findOrCreateRoute,
}
