import React, { Component } from 'react'
import { withService, andState } from '../reser'

class Home extends Component {

  state = { email: '', password: '' }

  constructor(props) {
    super(props)
    // Create a reference to user service
    this.userService = props.services.user
  }

  signIn = e => {
    e.preventDefault()
    // If the sign-in succedded, component will update automatically
    this.userService.signIn(this.state.email, this.state.password)
  }

  changeField = (e, field, value) => {
    e.preventDefault()
    this.setState({ [field]: value })
  }

  viewUser = (user) => {
    return <div>
      <h1>Hello, {user.name}!</h1>
      <div>Id: {user.id}</div>
      <div>Name: {user.name}</div>
      <div>Age: {user.age}</div>
      <div>Email: {user.email}</div>
      <br />
      <button type="button" onClick={() => this.userService.logOut()}>
        Sign Out
      </button>
    </div>
  }

  viewForm = () => {
    return <div>
      <h1>Sign In</h1>
      <input
        type="text"
        name="email"
        placeholder="Email"
        value={this.state.email}
        onChange={e => this.changeField(e, 'email', e.target.value)} />
      <br />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={this.state.password}
        onChange={e => this.changeField(e, 'password', e.target.value)} />
      <br /> <br />
      <button type="button" onClick={this.signIn}>
        Sign In
      </button>
    </div>
  }

  render() {
    console.log(this.props.services)
    const currentUser = this.props.state.user
    // It will display `Hello, Foo!` or sign-in form
    return (
      <div>
        {
          currentUser.id ?
            this.viewUser(currentUser) :
            this.viewForm()
        }
      </div>
    )
  }
}

// Here we inject `user` service and its state.
// Remove andState, if you only need the service.
// export default withService('user', 'async', andState())(Home)
export default withService('user', andState())(Home)
