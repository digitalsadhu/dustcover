'use strict'
/* global describe, it, beforeEach */
const expect = require('chai').expect
const dustcover = require('../')
const Bookshelf = require('./helpers/bookshelf')
const models = require('./helpers/models')
const migrations = require('./helpers/migrations')
const seeds = require('./helpers/seeds')
let bookshelf
let Models

describe('dustcover', function () {
  beforeEach(function () {
    bookshelf = Bookshelf()
    bookshelf.plugin(dustcover, {host: 'http://localhost:3000'})
    Models = models(bookshelf)
    return migrations(bookshelf).then(() => seeds(bookshelf))
  })

  describe('fetching all records', function () {
    it('toJSON should serialize an array of models in JSON API format', function () {
      return Models.Book.fetchAll().then((books) => {
        const serialized = books.toJSON({type: 'books'})
        expect(serialized).to.include.key('data')
        expect(serialized.data).to.be.an('array')
        expect(serialized.data[0]).to.include.keys('id', 'type', 'attributes')
        expect(serialized.data[0].type).to.equal('books')
      })
    })

    it('type should be determined automatically if available', function () {
      return Models.Cat.fetchAll().then((cats) => {
        const serialized = cats.toJSON()
        expect(serialized.data[0].type).to.equal('cats')
        expect(serialized.data[0].attributes).to.not.have.key('type')
      })
    })

    it('empty result array should still be keyed by data', function () {
      return Models.House.fetchAll().then((houses) => {
        const serialized = houses.toJSON()
        expect(serialized.data).to.be.an('array')
        expect(serialized.data.length).to.equal(0)
      })
    })
  })

  describe('fetching a single record', function () {
    it('toJSON should serialize a model in JSON API format', function () {
      return new Models.Cat({id: 1}).fetch().then((cat) => {
        const serialized = cat.toJSON()
        expect(serialized).to.include.key('data')
        expect(serialized.data).to.be.an('object')
        expect(serialized.data).to.include.keys('id', 'type', 'attributes', 'links')
        expect(serialized.data.type).to.equal('cats')
        expect(serialized.data.links.self).to.equal('http://localhost:3000/cats/1')
      })
    })

    it('relationships key should absent if none exist', function () {
      return new Models.Book({id: 1}).fetch().then((book) => {
        expect(book.toJSON().data).to.not.include.key('relationships')
      })
    })

    it('relationships key should be populated if any exist', function () {
      return new Models.Cat({id: 1}).fetch().then((cat) => {
        const serialized = cat.toJSON()
        expect(serialized.data).to.include.key('relationships')
        expect(serialized.data.relationships).to.be.an('object')
        expect(serialized.data.relationships).to.include.key('owner')
        expect(serialized.data.relationships.owner).to.include.key('links')
        expect(serialized.data.relationships.owner.links).to.include.key('related')
        expect(serialized.data.relationships.owner.links.related).to.equal('http://localhost:3000/cats/1/owner')
        expect(serialized.data.relationships.owner).to.not.include.key('data')
      })
    })
  })
})
