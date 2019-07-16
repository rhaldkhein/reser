import React from 'react'
import { withNewService } from '../reser'

function name(state = { asyncName: 'Foo' }, action) {
  return state
}

function AsyncPage(props) {
  return <div>Async View</div>
}

function NewService() {
  this.name = 'Kevin'
}

function registry(services) {
  services.add(NewService, 'newservice')
}

export default class Async {

  static reducer = name
  static persist = true

  title = 'Async Service'

  View = withNewService(registry)(AsyncPage)

}
