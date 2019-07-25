# Reser

An asynchronous DI framework for modular React and React-Native using [JService](https://github.com/rhaldkhein/jservice).

**Key Features**

- Dependency injection
- Asynchronous service
- Code splitting
- Persistent `redux` state
- Abstraction for `react-redux`
- For both `react` and `react-native`

***JService** is a small, powerful, non-opinionated pure javascript DI container.*

## Install

```sh
npm install jservice redux react-redux
```

## Basic Usage

Create project with `create-react-app` and register all your services in registry file.

In file `registry.js`, you can add or configure services. There are also some built-in services you can configure like `store` (derived from redux), `storage` (derived from localstorage), etc.

```javascript
import UserService from './services/user.js'
// ...

export default function (services) {

  services.add(UserService)
  services.add(BookingService)

  // Services with components
  services.add(MapService)
  services.add(SocialService)
  
  // Async services
  services.add(() => import('./services/myAsync'), 'async')

  // ...
}
```

In file `App.js`, you have to wrap it with `withContainer` and pass registry and root component.

```javascript
import React from 'react'
import { withContainer } from 'reser'
import registry from './registry.js'
// ...

import Home from './routes/Home'
// ...

function App({ container }) {
  return (
    container.isReady &&
    <div className="App">
      <Home />
    </div>
  )
}

// Inject root component with DI container
export default withContainer(registry)(App)
```

Services are the basic building blocks for dependency injection. And here's the file `services/user.js` that depends on `store` service to get the state or dispatch an action.

```javascript
const initial = {
  id: null,
  name: 'Unknown',
  age: 0
}

function reducer(state = initial, action) {
  // ...
}

export default class UserService {
  static service = 'user'
  static reducer = reducer
  static persist = true // Save state to local storage

  constructor(provider) {
    // Let's inject the built-in store service
    this.store = provider.service('store')
    // And http service to handle REST request
    this.http = provider.service('http')
  }

  getCurrentUser() {
    return this.store.getState().user.current
  }

  signIn(email, password) {
    return this.http.post('/signin', { email, password })
      .then(user => {
        return this.store.dispatch({
          type: 'SET_CURRENT_USER',
          user
        })
      })
  }

  // ...
}
```

Then route component `routes/Home.js` that depends on `user` service. To inject service in component, use `withService`.

```javascript
import React from 'react'
import { withService, andState } from 'reser'

class Home {

  state = { email: null, password: null }

  constructor(props) {
    super(props)
    // Create a reference to user service
    this.userService = props.services.user
  }

  signIn = e => {
    e.preventDefault()
    // If the sign-in succedded, component will update automatically
    this.userService.signIn(this.state.email, this.state.password)
  }

  render() {
    const currentUser = this.props.state.user
    // It will display `Hello, Foo!` or sign-in form
    return (
      <div>
        {
          currentUser.id ?
          <h1>Hello, {currentUser.name}!</h1> :
          <div>
            <input type="text" name="email" value={this.state.email} />
            <input type="password" name="password" value={this.state.password}  />
            <button onClick={this.signIn}>Sign In</button>
          </div>
        }
      </div>
    )
  }
}

// Here we inject `user` service and its state.
// Remove andState, if you only need the service.
export default withService('user', andState())(Home)
```

## License

MIT License - Copyright (c) 2019 RhaldKhein
