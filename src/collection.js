import { firstDefined } from './utils'

export default function (Bookshelf, config) {
  const { Collection } = Bookshelf

  return Collection.extend({
    /**
     * Call super then convert payload into
     * JSON API format
     */
    serialize (options = {}) {
      const Model = this.model
      const isJSONAPI = firstDefined(options.jsonapi, new Model().jsonapi, !config.optIn)
      const serialized = Collection.prototype.serialize.apply(this, arguments)

      if (!isJSONAPI) return serialized

      return { data: serialized.map((item) => item.data) }
    }

    /**
     * Augment set to accept jsonapi payload and process
     * in addition to key/value and {key:value} forms
     * before calling super
     */
    // set () {
    //   modelProto.set.apply(this, arguments)
    // }
  })
}
