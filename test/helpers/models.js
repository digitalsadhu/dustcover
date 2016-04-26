module.exports = function (Bookshelf) {
  const models = {
    Book: Bookshelf.Model.extend({
      tableName: 'book'
    }),
    Cat: Bookshelf.Model.extend({
      tableName: 'cat',
      type: 'cats',
      relationships: ['owner', 'mice'],
      owner () {
        return this.belongsTo(models.Owner)
      },
      mice () {
        return this.hasMany(models.Mouse)
      }
    }),
    House: Bookshelf.Model.extend({
      tableName: 'house',
      type: 'houses'
    }),
    Owner: Bookshelf.Model.extend({
      tableName: 'owner',
      type: 'owners'
    }),
    Mouse: Bookshelf.Model.extend({
      tableName: 'mouse',
      type: 'mice'
    }),
    Hat: Bookshelf.Model.extend({
      tableName: 'hat',
      type: 'hats',
      jsonapi: true
    }),
    Dress: Bookshelf.Model.extend({
      tableName: 'dress',
      type: 'dresses',
      jsonapi: false
    })
  }

  return models
}
