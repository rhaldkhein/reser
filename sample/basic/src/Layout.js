import React from 'react'
import Home from './Home'
import { withService, andState } from './react-jservice';

function Layout({ services, state }) {
  console.log('Layout', services, state);
  return <div>
    <Home />
  </div>
}

export default withService('test', andState())(Layout)
