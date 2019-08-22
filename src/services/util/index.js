import * as proto from './proto'

class Util {
  static service = 'util'
  _core = null

  constructor(provider, custom) {
    this._core = provider.get('core')
    for (const key in custom) {
      if (this[key]) {
        // eslint-disable-next-line no-console
        console.warn(`Built-in util can't add existing "${key}"`)
        continue
      }
      this[key] = custom[key]
    }
  }

  getStatics(prop, options = {}) {
    let { names, services } = this._core.collection
    let result = {}
    names = this.invert(names)
    for (let i = 0; i < services.length; i++) {
      let desc = services[i]
      let service = desc.value
      let value = service[prop]
      if (value === undefined || !desc.enabled) continue
      if (options.merge) {
        Object.assign(result, value)
        continue
      }
      result[names[i]] = value
    }
    return result
  }

}

Object.assign(Util.prototype, proto)

export default Util
