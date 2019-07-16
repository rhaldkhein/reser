import React from 'react';
import { withContainer } from './reser'
import registry from './registry'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import Home from './Home'

function Index() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

function App({ container }) {
  // console.log(container)
  const util = container.provider.get('util')
  const res = util.getStatics('mergetest', {
    merge: true
  })
  console.log(res);
  util.loadAsyncServices().then(res => {
    console.log(res)
  })
  return (
    container.isReady &&
    <div className="App">
      <Router>
        <header>
          <h1>Reser</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/users">Users</Link>
              </li>
            </ul>
          </nav>
        </header>
        <div>
          <Route path="/" exact component={Index} />
          <Route path="/about" component={About} />
          <Route path="/users" component={Users} />
        </div>
        <div>
          <Home />
        </div>
      </Router>
    </div>
  )
}

export default withContainer(registry)(App);
