import { ServiceCollection as BaseServiceCollection } from 'jservice'

class ServiceCollection extends BaseServiceCollection {

  _push(service, desc) {
    if (desc.type === 0 && desc.typeof === 'function') {
      service = (service => () => {
        return service()().then(s => desc.asyncService = s.default)
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
