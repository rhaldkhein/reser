const initial = {
  id: 0,
  name: '',
  age: 0,
  email: ''
}

function reducer(state = initial, action) {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return action.payload
    case 'REMOVE_CURRENT_USER':
      return initial
    default:
      return state
  }
}

export default class UserService {
  static service = 'user'
  static reducer = reducer
  static persist = true // Save state to local storage

  constructor(provider) {
    // Let's inject the built-in store service
    this.store = provider.service('store')
    this.state = this.store.state.user
  }

  getCurrentUser() {
    return this.state().current
  }

  signIn(email, password) {
    if (!email || !password) return
    // For demo purpose, we're mocking request
    Promise.resolve({ id: 123, name: 'Foo', age: 14, email })
      .then(user => {
        return this.store.dispatch({
          type: 'SET_CURRENT_USER',
          payload: user
        })
      })
  }

  logOut() {
    return this.store.dispatch({
      type: 'REMOVE_CURRENT_USER'
    })
  }

}
