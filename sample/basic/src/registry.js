
function hello(state = { name: 'default' }, action) {
  return state
}

class Test {
  static service = 'test'
  static reducer = hello
  static persist = true
  name = 'Test'
}

const FuncService = function (params) {
  this.name = 'Func'
}

export default function (services) {

  services.add(Test)

  services.add(FuncService, 'func')

  services.add(() => import('./services/async'), 'async')

}
