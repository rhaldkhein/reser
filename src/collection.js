import { ServiceCollection as BaseServiceCollection } from 'jservice'
import { isConstructor } from './services/util/proto'

class ServiceCollection extends BaseServiceCollection {

  _push(service, desc) {
    if (desc.type === 0 && desc.typeof === 'function') {
      service = (service => () => {
        return service()().then(s => {
          const Service = s.default
          if (isConstructor(Service) && Service.setup)
            Service.setup(this.container)
          return desc.asyncService = Service
        })
      })(service)
    }
    return super._push(service, desc)
  }

  scoped() {
    throw new Error('Scoped services are not supported yet')
  }

  transient() {
    throw new Error('Transient services are not supported yet')
  }

}

export default ServiceCollection
