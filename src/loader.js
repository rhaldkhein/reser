import { isFunction, isConstructor } from './services/util/proto'

class Loader {

  constructor(provider, loader, name, config) {
    this._provider = provider
    this._loader = loader
    this._name = name
    this._config = config
    this._service = null
    this._loading = null
    this.value = null
  }

  _fetch() {
    if (this._service) return Promise.resolve(this._service)
    if (!this._loader)
      throw new Error('Async loader is not referenced to a service')
    return this._loader()
      .then(Service => {
        this._service = Service.default || Service
        return this._service
      })
  }

  load(onlyNew) {
    if (this.value && onlyNew) return Promise.resolve()
    if (this._loading) {
      if (onlyNew) return Promise.resolve()
      return this._loading
    }
    if (this.value) return Promise.resolve(this.value)
    // Continue fetching and creating instance
    this._loading = this._fetch()
      .then(Service => {
        let result
        if (isConstructor(Service)) {
          result = new Service(
            this._provider,
            this._config && this._config(this._provider)
          )
        } else if (isFunction(Service)) {
          result = Service()
        } else {
          result = Service
        }
        this.value = result
        this._loading = null
        if (Service.persist) {
          return this._provider.service('store')
            ._persistService(Service, this._name)
        }
      })
      .then(() => this.value)
    return this._loading
  }

}

export default Loader
