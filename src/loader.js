import { _isFunction, _isConstructor } from './misc/util'

/**
 * Responsible for loading an async module.
 */
class Loader {

  constructor(loader, provider, config) {
    this._loader = loader
    this._provider = provider
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
    this._loading = this._fetch().then(Service => {
      let result
      if (_isConstructor(Service)) {
        result = new Service(
          this._provider,
          this._config && this._config(this._provider)
        )
      } else if (_isFunction(Service)) {
        result = Service()
      } else {
        result = Service
      }
      this.value = result
      this._loading = null
      return result
    })
    return this._loading
  }

}

/**
 * Export
 */
export default Loader