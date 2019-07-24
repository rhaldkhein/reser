import { ServiceProvider as BaseServiceProvider } from 'jservice'
import { isFunction, isConstructor } from './services/util/proto'

class ServiceProvider extends BaseServiceProvider {

  _callback = null

  _getAsyncGetter(name, promise) {
    const serviceDesc = this._collection.get(name)
    if (serviceDesc.asyncGetter) return serviceDesc.asyncGetter
    return serviceDesc.asyncGetter = () => {
      // Return existing instance
      if (serviceDesc.asyncInstance) return Promise.resolve(serviceDesc.asyncInstance)
      if (serviceDesc.asyncFetching) return serviceDesc.asyncFetching
      // Create new instance
      return serviceDesc.asyncFetching = promise.then(() => {
        let asyncInstance
        const { asyncService: Service, config } = serviceDesc
        if (isConstructor(Service)) {
          if (Service.setup) Service.setup(this._collection.container)
          if (Service.start) Service.setup(this)
          if (Service.ready) Service.setup(this)
          const store = this.service('store')
          store._persistService(Service, name)
          asyncInstance = new Service(
            this._createServiceProvider(serviceDesc),
            isFunction(config) ? config(this) : config
          )
        } else {
          asyncInstance = isFunction(Service) ? Service() : Service
        }
        serviceDesc.asyncInstance = asyncInstance
        serviceDesc.asyncFetching = null
        this._callback(name)
        return asyncInstance
      })
    }
  }

  _createService(name) {
    const instance = super._createService(name)
    return instance instanceof Promise ? this._getAsyncGetter(name, instance) : instance
  }

  setAsyncLoadCallback(callback) {
    this._callback = callback
  }

  /**
   * This method is design for component HOC, but also be used on other things
   */
  createServices(serviceNames) {
    let result = {}
    for (let i = 0; i < serviceNames.length; i++) {
      const name = serviceNames[i]
      const serviceDesc = this._collection.get(name)
      if (serviceDesc.asyncInstance) {
        result[name] = serviceDesc.asyncInstance
        continue
      }
      const instance = this.service(name)
      result[name] = isFunction(instance) ? null : instance
    }
    return result
  }

}

export default ServiceProvider
