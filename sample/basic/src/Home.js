import React from 'react'
import { withService } from './reser';

function Home(props) {
  const { async } = props.services
  if (async) console.log(async);
  return <div>
    <h1>Home</h1>
    <div>
      {
        async &&
        <async.View />
      }
    </div>
  </div>
}

export default withService('async')(Home)