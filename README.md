# dustcover

JSONAPI plugin for the bookshelfjs ORM

[![NPM](https://nodei.co/npm/dustcover.png?downloads=true&stars=true)](https://nodei.co/npm/dustcover/)

[![Media Suite](http://mediasuite.co.nz/ms-badge.png)](http://mediasuite.co.nz)

[![Build Status](https://travis-ci.org/digitalsadhu/dustcover.svg?branch=master)](https://travis-ci.org/digitalsadhu/dustcover)

## Features

The plan for dustcover is to provide a full featured [jsonapi](http://jsonapi.org/) implementation for bookshelf with little to no
configuration. It's very early (alpha) days at this point and the only thing thats even partially supported
is jsonapi serialization. Stay tuned. Chip in if this interests you, PRs and collaboration welcome.

## Installation

```
npm install dustcover --save
```

## Usage

### Require dependencies
```js
const Bookshelf = require('bookshelf')
const Knex = require('knex')
const dustcover = require('dustcover')
```

### Setup bookshelf
```js
const bookshelf = Bookshelf(Knex({
  client: 'sqlite3',
  connection: { filename: ':memory:' },
  useNullAsDefault: true
}))

const options = {
  // Set the host that will be used in links during serialization
  // default: host omitted from links
  host: 'http://localhost:3000',

  // Specify whether models should be serialized by default, or
  // require opting in to serialization
  // when true, models will need to opt in to serialization by
  // defining a key `jsonapi` and setting it to true. (See below)
  // default: false
  optIn: false
}
bookshelf.plugin(dustcover, options)
```

### Setup models
```js
const Cat = bookshelf.Model.extend({

  // standard bookshelf table definition
  tableName: 'cat',

  // dustcover jsonapi model type definition
  // see jsonapi spec for type information.
  // This is usually (but not required to be) plural
  type: 'cats',

  // dustcover requires you to specify which relationships
  // should be handled. You do so by specifying them in an array
  relationships: ['owner', 'mice'],

  // allows opting in or out of jsonapi serialization by default for
  // the model. If optIn (see above) is set to true then you will
  // need to set jsonapi: true on every model you wish to be serialized
  // to jsonapi when calling `model.toJSON`
  // You can override these settings by setting jsonapi: true in toJSON
  // like so: model.toJSON({jsonapi: true})
  jsonapi: true,

  // standard bookshelf relationship definitions
  // these will be referenced by dustcover if they have been
  // specified in the relationships array above.
  owner () {
    return this.belongsTo(Owner)
  },
  mice () {
    return this.hasMany(Mouse)
  }
})
```

### Serializing models

dustcover overrides the serialize methods of models and collections such
that when you call `collection.toJSON()` or `model.toJSON()` you will get
jsonapi compatible data instead of just the usual attributes hash.

```js
new Cat().fetch().then(cat => {
  cat.toJSON()
})
```

will output something like:
```js
{
  data: {
    id: '1',
    type: 'cats',
    attributes: {
      name: 'Boris'
    },
    links: {
      self: 'http://localhost:3000/cats/1'
    },
    relationships: {
      owner: {
        links: {
          related: 'http://localhost:3000/cats/1/owner'
        }
      },
      mice: {
        links: {
          related: 'http://localhost:3000/cats/1/mice'
        }
      }
    }
  }
}
```

#### You can override a couple things when you call `toJSON`

Change the type field like so:
```js
cat.toJSON({type: 'kittycats'})
```

Remove or adjust relationship serialization like so:
```js
cat.toJSON({relationships: false})
```

Force jsonapi serialization or non serialization like so:
(see above for additional details)
```js
cat.toJSON({jsonapi: false})
```
