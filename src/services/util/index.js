import * as proto from './proto'

class Util {
  static service = 'util'
  _core = null

  constructor(provider, custom) {
    this._core = provider.get('__core__')
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
      let service = services[i]
      if (service.async) {
        service = service()._service
        if (!service) continue
      }
      let value = service[prop]
      if (value === undefined) continue
      if (options.merge) {
        Object.assign(result, value)
        continue
      }
      result[names[i]] = value
    }
    return result
  }

  loadAsyncServices(...serviceNames) {
    let { names, services } = this._core.collection
    let toLoad = []
    names = this.invert(names)
    for (let i = 0; i < services.length; i++) {
      let service = services[i]
      if (!service.async) continue
      service = service()
      if (serviceNames.length &&
        serviceNames.indexOf(names[i]) === -1)
        continue
      toLoad.push(service.load())
    }
    return Promise.all(toLoad)
  }

}

Object.assign(Util.prototype, proto)

export default Util