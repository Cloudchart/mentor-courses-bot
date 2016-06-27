import invariant from 'fbjs/lib/invariant'
import r, { run } from './db'


class Model {


  constructor(config) {
    invariant(config.name, `Model should be named.`)

    this.name = config.name
    this.tableName = config.tableName || config.name

    this.table = r.table(this.tableName)

    this._config = config
  }


  load = (id) =>
    run(this.table.get(id))

  loadAll = () =>
    run(this.table).then(result => result.toArray())

  loadMany = (ids) =>
    run(this.table.getAll(...ids)).then(result => result.toArray())

  filter = (fn) =>
    run(this.table.filter(fn)).then(result => result.toArray())

  create = (attributes) =>
    run(this.table.insert({ ...attributes, created_at: r.now(), updated_at: r.now() }))

  update = (id, attributes) =>
    run(this.table.get(id).update({ ...attributes, updated_at: r.now() }))

  destroy = (id) =>
    run(this.table.get(id).delete())

}


export default Model
