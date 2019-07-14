import { ServiceCollection as BaseServiceCollection } from 'jservice'
import { _isFunction, _isConstructor } from './misc/util'
import Loader from './loader'

class ServiceCollection extends BaseServiceCollection {

  constructor(core) {
    super(core)
    this._core = core
  }

  _push(Service, name, config, skip) {
    // Check if service is async or not
    if (_isFunction(Service) && !_isConstructor(Service)) {
      // Async service
      const loader = new Loader(Service, this._core.provider, config)
      const LoaderService = () => loader
      LoaderService.type = Service.type
      LoaderService.service = name
      Service = LoaderService
    }
    super._push(Service, name, config, skip)
  }

  scoped() {
    throw new Error('Scoped services are not supported yet')
  }

  transient() {
    throw new Error('Transient services are not supported yet')
  }


}

export default ServiceCollection