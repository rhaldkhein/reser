import { ServiceProvider as BaseServiceProvider } from 'jservice'
import { isFunction, isConstructor } from './services/util/proto'

class ServiceProvider extends BaseServiceProvider {

  _instancesAsync = {}

  _createService(name) {
    let instance = super._createService(name)
    if (instance instanceof Promise) {
      // For now async service is singleton
      return instance.then(Service => {
        let asyncInstance = this._instancesAsync[name]
        if (asyncInstance) return asyncInstance
        const service = this._collection.get(name)
        const { config } = service
        if (isConstructor(Service)) {
          asyncInstance = new Service(
            this._createServiceProvider(service),
            isFunction(config) ? config(this) : config
          )
        } else {
          asyncInstance = isFunction(Service) ? Service() : Service
        }
        this._instancesAsync[name] = asyncInstance
        return asyncInstance
      })
    }
    return instance
  }

  createServices(serviceNames, callback) {
    let result = {}
    for (let i = 0; i < serviceNames.length; i++) {
      const name = serviceNames[i]
      let instance = this.service(name)
      if (instance instanceof Promise) {
        // Async service
        let asyncInstance = this._instancesAsync[name]
        if (!asyncInstance) instance.then(() => {
          setTimeout(callback, 3000)
        })
        instance = asyncInstance
      }
      result[name] = instance
    }
    return result
  }

}

export default ServiceProvider
