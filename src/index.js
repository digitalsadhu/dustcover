'use strict'

import Model from './model'
import Collection from './collection'

export default function (Bookshelf, config) {
  Bookshelf.Model = Model(Bookshelf, config)
  Bookshelf.Collection = Collection(Bookshelf, config)
}
