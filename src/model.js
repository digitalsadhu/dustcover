export default function (Bookshelf, config) {
  const { Model } = Bookshelf

  const JSONAPIModel = Model.extend({
    /**
     * Call super then convert payload into
     * JSON API format
     */
    serialize (options = {}) {
      const type = options.type || this.type
      const relationships = options.relationships || this.relationships

      // TODO: calculate withRelated
      const withRelated = false

      const serialized = Model.prototype.serialize.apply(this, arguments)
      const { id } = serialized
      delete serialized.id

      let data = {
        data: {
          id,
          type,
          attributes: serialized,
          links: {
            self: `${config.host}/${type}/${id}`
          }
        }
      }

      if (relationships) {
        data.data.relationships = {}

        relationships.forEach((relationship) => {
          data.data.relationships[relationship] = {
            links: { related: `${config.host}/${type}/${id}/${relationship}` }
          }
        })

        if (withRelated) {
          // TODO:
          // 1. populate data.data.relationships[relationship].data = [{type: id:}]
          // 2. populate data.included = [{type: id: attributes: ...etc}]
        }
      }

      return data
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

  return JSONAPIModel
}
