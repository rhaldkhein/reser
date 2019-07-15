import React from 'react'
import Home from './Home'
import { withService, andState } from './reser';

function Layout({ services, state }) {
  console.log('Layout', services, state);
  return <div>
    <Home />
  </div>
}

export default withService('test', andState())(Layout)
