import User from './services/user'
// import Async from './services/async'

// const Anon = provider => {
//   const user = provider.get('user')
//   console.log('U', user);
//   return {
//     a: 1
//   }
// }

function Anon(provider) {
  const user = provider.get('user')
  console.log('U', user);
  return {
    a: 2
  }
}

export default function (services) {

  services.add(User)
  services.add(Anon, 'func')
  services.lazy(() => import('./services/async'), 'async')
  // services.add(Async, 'async')

}
