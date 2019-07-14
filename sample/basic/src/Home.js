import React from 'react'
import { withService } from './react-jservice';

function Home({ services: { async, test } }) {
  console.log('Home', async, test);
  return <div>
    <h1>Home</h1>
    <div>{test ? 'Loaded' : 'Loading'}</div>
    <div>{async ? 'Loaded' : 'Loading'}</div>
  </div>
}

export default withService(Home, 'test', 'func', 'async')