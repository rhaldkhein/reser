import React from 'react';
import { withContainer } from './reser'
import registry from './registry'

import Home from './routes/Home'

function App({ container }) {
  console.log(container);
  const { Hello } = container.provider.get('hello')

  return (
    container.isReady &&
    <div className="App">
      <Home />
      <Hello />
    </div>
  )
}

export default withContainer(registry)(App);
