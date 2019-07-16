# Reser

An asynchronous DI framework for modular React and React-Native using [JService](https://github.com/rhaldkhein/jservice).

**Key Features**

- Dependency Injection
- Asynchronous Service
- Code Splitting
- Persistent `redux` Store
- Abstraction for `react-redux`
- For `react` and `react-native`

## Install

```sh
npm install jservice redux react-redux
```

## Basic Usage

Create project with `create-react-app` and register all your services in registry file.

File `registry.js`

```javascript
import UserService from './services/user.js'
// ...

export default function (services) {

  services.add(UserService)
  services.add(BookingService)

  // Services with components

  services.add(MapService)
  services.add(SocialService)

}
```

File `App.js`

```javascript
import React from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import { withContainer } from 'reser'
import registry from './registry.js'

import Home from './routes/Home'
// ...

function App({ container }) {
  return (
    container.isReady &&
    <div className="App">
      <header>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/users">Users</Link></li>
        </ul>
      </header>
      <div>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
        <Route path="/users" component={Users} />
      </div>
    </div>
  )
}

// Inject root component with DI container
export default withContainer(registry)(App)
```

File `services/user.js`

```javascript
const initial = {
  id: null,
  name: 'Unknown',
  age: 0
}

function reducer(state = initial, action) {
  // ...
}

class UserService {
  static service = 'user'
  static reducer = reducer

  store = null

  constructor(provider) {
    // Let's inject the built-in store service
    this.store = provider.service('store')
  }

  getCurrent() {
    return this.store.getState().user.current
  }

  signIn(email, password) {
    return this.store.dispatch({
      type: 'SIGNIN_USER',
      email,
      password
    })
  }

  // ...
}
```

File `routes/Home.js`

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

MIT

