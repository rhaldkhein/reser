import React from 'react'
import User from './services/user'

function Hello(props) {
  return <div className="hello">Hello</div>
}

export default function (services) {
  services.add(User)
  services.add({ Hello }, 'hello')
}
