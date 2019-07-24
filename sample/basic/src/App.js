import React from 'react';
import { withContainer } from './reser'
import registry from './registry'

import Home from './routes/Home'

class App extends React.Component {
  constructor(props) {
    super(props)
    console.log('App', props.container)
    const async = props.container.provider.get('async')
    // console.log('A', async);
    // async.then(a => console.log(a))
    async().then(i => console.log('A', i))
  }
  render() {
    return (
      this.props.container.isReady &&
      <div className="App">
        <Home />
      </div>
    )
  }
}

export default withContainer(registry)(App);
