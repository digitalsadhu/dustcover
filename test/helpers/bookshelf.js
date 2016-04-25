const Bookshelf = require('bookshelf')
const Knex = require('knex')

module.exports = function () {
  return Bookshelf(Knex({
    client: 'sqlite3',
    connection: { filename: ':memory:' },
    useNullAsDefault: true
  }))
}
