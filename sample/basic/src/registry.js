import User from './services/user'

export default function (services) {

  services.add(User)
  services.add(() => import('./services/async'), 'async')

}
