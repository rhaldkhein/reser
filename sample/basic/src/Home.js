import React from 'react'
import { withService, andState } from './reser';

function Home({ services, state }) {
  console.log('Home', services, state);
  return <div>
    <h1>Home</h1>
    <div>{services.test ? 'Loaded ' + state.test.name : 'Loading'}</div>
    <div>{services.async ? 'Loaded ' + state.async.asyncName : 'Loading'}</div>
  </div>
}

export default withService('test', 'func', 'async', andState())(Home)
