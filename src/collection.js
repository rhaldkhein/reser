import { ServiceCollection as BaseServiceCollection } from 'jservice'
import { isFunction, isConstructor } from './services/util'
import Loader from './loader'

class ServiceCollection extends BaseServiceCollection {

  constructor(core) {
    super(core)
    this._core = core
  }

  _push(Service, name, config, skip) {
    // Check if service is async or not
    if (isFunction(Service) && !isConstructor(Service)) {
      // Async service
      Service.service = name
      const loader = new Loader(this._core.provider, Service, name, config)
      const LoaderService = () => loader
      LoaderService.type = Service.type
      LoaderService.service = name
      LoaderService.async = true
      Service = LoaderService
    }
    super._push(Service, name, config, skip)
  }

  isAsyncService(name) {
    const { names, services } = this
    for (const key in names) {
      if (names.hasOwnProperty(key) && key === name) {
        return services[names[key]].async || false
      }
    }
    return true
  }

  scoped() {
    throw new Error('Scoped services are not supported yet')
  }

  transient() {
    throw new Error('Transient services are not supported yet')
  }


}

export default ServiceCollection
