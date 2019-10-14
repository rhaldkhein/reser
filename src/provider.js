import { ServiceProvider as BaseServiceProvider } from 'jservice'
import { isConstructor, isFunction } from 'jservice-common/lib/util/proto'

class ServiceProvider extends BaseServiceProvider {

  _callback = null

  _getAsyncGetter(serviceDesc, promise) {
    const { name } = serviceDesc
    if (serviceDesc.asyncGetter) return serviceDesc.asyncGetter
    return serviceDesc.asyncGetter = () => {
      // Return existing instance
      if (serviceDesc.asyncInstance) return Promise.resolve(serviceDesc.asyncInstance)
      if (serviceDesc.asyncFetching) return serviceDesc.asyncFetching
      // Create new instance
      return serviceDesc.asyncFetching = promise.then(() => {
        let asyncInstance
        const { asyncService: Service, config } = serviceDesc
        const serviceProvider = this._createServiceProvider(serviceDesc)
        const serviceConfig = isFunction(config) ? config(this) : config
        if (isConstructor(Service)) {
          ((Service.start && Service.start(this)) || Promise.resolve())
            .then(() => {
              if (Service.ready) Service.ready(this)
              this._callback(name)
            })
          const store = this.service('store')
          store._persistService(Service, name)
          asyncInstance = new Service(serviceProvider, serviceConfig)
        } else {
          asyncInstance = isFunction(Service) ?
            Service(serviceProvider, serviceConfig) :
            Service
        }
        serviceDesc.asyncInstance = asyncInstance
        serviceDesc.asyncFetching = null
        return asyncInstance
      })
    }
  }

  _createService(name) {
    const serviceDesc = this._collection.get(name)
    const instance = super._createService(name)
    return serviceDesc && serviceDesc.lazy ? this._getAsyncGetter(serviceDesc, instance) : instance
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
      const name = serviceNames[i].toLowerCase()
      const serviceDesc = this._collection.get(name)
      if (serviceDesc && serviceDesc.asyncInstance) {
        result[name] = serviceDesc.asyncInstance
        continue
      }
      const instance = this.service(name)
      if (isFunction(instance)) {
        instance()
        result[name] = null
      } else {
        result[name] = instance
      }
    }
    return result
  }

}

export default ServiceProvider
