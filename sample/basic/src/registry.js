import User from './services/user'
// import Async from './services/async'

export default function (services) {

  services.add(User)
  services.add(() => import('./services/async'), 'async')
  // services.add(Async, 'async')

}
