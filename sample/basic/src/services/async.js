
function name(state = { asyncName: 'Foo' }, action) {
  return state
}

export default class Async {

  static reducer = name
  static persist = true

  title = 'Async Service'
}

