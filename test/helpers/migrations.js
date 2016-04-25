var _ = require('lodash')
var Promise = require('bluebird')

var drops = [
  'book', 'cat'
]

module.exports = function (Bookshelf) {
  var schema = Bookshelf.knex.schema

  return Promise.all(_.map(drops, function (val) {
    return schema.dropTableIfExists(val)
  }))
  .then(function () {
    return schema.createTable('book', function (table) {
      table.increments('id')
      table.string('name')
      table.string('description')
    })
  })
  .then(function () {
    return schema.createTable('cat', function (table) {
      table.increments('id')
      table.string('name')
      table.string('description')
    })
  })
  .then(function () {
    return schema.createTable('house', function (table) {
      table.increments('id')
      table.string('name')
      table.string('description')
    })
  })
}
