import React from 'react'
import { withContainer, withService } from "../reser"

function Foo(props) {
  console.log('Foo', props)
  return null
}

const services = {
  async: false,
  user: s => ({
    email: s.email + 'nice!'
  })
}

const FooWithService = withService(services)(Foo)

function SubContainer() {
  return <div>
    <FooWithService />
  </div>
}

function registry(services) {
  function YayService() {
    // body
  }
  YayService.mount = function (p, s) {
    console.log('Yay is mounted!', p, s);
    // return new Promise(resolve => {
    //   setTimeout(resolve, 3000)
    // })
  }
  services.add(YayService, 'yay')
}

export default withContainer(registry)(SubContainer)