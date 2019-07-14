import React from 'react'
import Home from './Home'
import { withService } from './react-jservice';

function Layout({ services: { async } }) {
  console.log('Layout', async);
  return <div>
    <Home />
  </div>
}

export default withService(Layout, 'test', 'async')