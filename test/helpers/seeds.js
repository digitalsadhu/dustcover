var Promise = require('bluebird')

module.exports = function (Bookshelf) {
  var knex = Bookshelf.knex

  return Promise.join(
    knex('book').del(),
    knex('cat').del(),
    knex('house').del()
  )
  .then(() => Promise.join(
    knex('book').insert({id: 1, name: 'book 1', description: 'my first book'}),
    knex('book').insert({id: 2, name: 'book 2', description: 'my second book'}),
    knex('book').insert({id: 3, name: 'book 3', description: 'my third book'}),
    knex('cat').insert({id: 1, name: 'cat 1', description: 'my first cat'}),
    knex('cat').insert({id: 2, name: 'cat 2', description: 'my second cat'})
  ))
}
