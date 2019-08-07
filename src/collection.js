import { ServiceCollection as BaseServiceCollection } from 'jservice'
import { isConstructor, isFunction } from './services/util/proto'

class ServiceCollection extends BaseServiceCollection {

  _push(service, desc) {
    if (desc.lazy) {
      service = (service => () => {
        return service().then(s => {
          const Service = s.default
          if (isConstructor(Service) && Service.setup)
            Service.setup(this.container)
          return desc.asyncService = Service
        })
      })(service)
    }
    return super._push(service, desc)
  }

  lazy(service, name, deps) {
    if (!service) return
    if (!name) throw new Error('Lazy service must have a name')
    if (!isFunction(service)) throw new Error('Lazy service must be a function')
    let desc = {
      name,
      deps,
      lazy: true,
      type: this.types.SINGLETON
    }
    this._push(service, desc)
  }

}

export default ServiceCollection
