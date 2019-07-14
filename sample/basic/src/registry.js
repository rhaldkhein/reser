
class Test {
  static service = 'test'
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