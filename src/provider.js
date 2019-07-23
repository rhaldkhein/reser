import { ServiceProvider as BaseServiceProvider } from 'jservice'
import { isFunction, isConstructor } from './services/util/proto'

class ServiceProvider extends BaseServiceProvider {

  asyncLoadCallback = null

  _createService(name) {
    let instance = super._createService(name)
    if (instance instanceof Promise) {
      const serviceDesc = this._collection.get(name)
      // Return existing instance
      if (serviceDesc.asyncInstance) return Promise.resolve(serviceDesc.asyncInstance)
      if (serviceDesc.asyncFetching) return serviceDesc.asyncFetching
      // Create new instance
      return serviceDesc.asyncFetching = instance.then(() => {
        let asyncInstance
        const { asyncService: Service, config } = serviceDesc
        if (isConstructor(Service)) {
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
        this.asyncLoadCallback(name)
        return asyncInstance
      })
    }
    return instance
  }

  setAsyncLoadCallback(callback) {
    this.asyncLoadCallback = callback
  }

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
      result[name] = instance instanceof Promise ? null : instance
    }
    return result
  }

}

export default ServiceProvider
