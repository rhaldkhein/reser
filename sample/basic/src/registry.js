
import { UtilService } from './reser'

function hello(state = { name: 'default' }, action) {
  return state
}

class Test {
  static service = 'test'
  static reducer = hello
  static persist = true
  static mergetest = {
    b: 2
  }
  name = 'Test'
}

const FuncService = function (params) {
  this.name = 'Func'
}

FuncService.mergetest = {
  a: 1
}

export default function (services) {

  services.add(Test)

  services.add(FuncService, 'func')

  services.add(() => import('./services/async'), 'async')

}
