import React from 'react'
import { withService } from './react-jservice';

function Home({ services }) {
  console.log('Home', services);
  return <div>
    <h1>Home</h1>
    <div>{services.test ? 'Loaded' : 'Loading'}</div>
    <div>{services.async ? 'Loaded' : 'Loading'}</div>
  </div>
}

export default withService('test', 'func', 'async')(Home)
