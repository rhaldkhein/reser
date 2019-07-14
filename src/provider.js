import { ServiceProvider as BaseServiceProvider } from 'jservice'
import Loader from './loader'

class ServiceProvider extends BaseServiceProvider {

  createServices(serviceNames, callback) {
    let services = {}
    for (let i = 0; i < serviceNames.length; i++) {
      const name = serviceNames[i]
      let service = this.service(name)
      if (service instanceof Loader) {
        service.load(true).then(isNew => isNew && callback())
        service = service.value
      }
      services[name] = service
    }
    return services
  }

}

export default ServiceProvider
