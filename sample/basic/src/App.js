import React from 'react';
import { withContainer } from './reser'
import registry from './registry'

import Home from './routes/Home'

function App({ container }) {
  return (
    container.isReady &&
    <div className="App">
      <Home />
    </div>
  )
}

export default withContainer(registry)(App);
