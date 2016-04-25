export default function (Bookshelf, config) {
  const { Model } = Bookshelf

  return Model.extend({
    /**
     * Call super then convert payload into
     * JSON API format
     */
    serialize (options = {}) {
      const type = options.type || this.type
      const serialized = Model.prototype.serialize.apply(this, arguments)
      const { id } = serialized
      delete serialized.id
      return {
        data: {
          id,
          type,
          attributes: serialized,
          links: {
            self: `${config.host}/${type}/${id}`
          }
        }
      }
    }

    /**
     * Augment set to accept jsonapi payload and process
     * in addition to key/value and {key:value} forms
     * before calling super
     */
    // set () {
    //   Model.prototype.set.apply(this, arguments)
    // }
  })
}
