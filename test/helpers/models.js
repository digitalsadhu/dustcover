module.exports = function (Bookshelf) {
  return {
    Book: Bookshelf.Model.extend({
      tableName: 'book'
    }),
    Cat: Bookshelf.Model.extend({
      tableName: 'cat',
      type: 'cats'
    }),
    House: Bookshelf.Model.extend({
      tableName: 'house',
      type: 'houses'
    })
  }
}
