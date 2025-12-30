import React from 'react'
import createReactClass from 'create-react-class'
import { withRouter } from 'react-router'
import auth from '../utils/auth.js'

const Login = createReactClass({
  getInitialState() {
    return {
      error: false
    }
  },

  handleSubmit(event) {
    event.preventDefault()

    const email = this.emailRef.value
    const pass = this.passRef.value

    auth.login(email, pass, (loggedIn) => {
      if (!loggedIn)
        return this.setState({ error: true })

      const { location } = this.props

      if (location.state && location.state.nextPathname) {
        this.props.router.replace(location.state.nextPathname)
      } else {
        this.props.router.replace('/')
      }
    })
  },

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label><input ref={(el) => { this.emailRef = el }} placeholder="email" defaultValue="joe@example.com" /></label>
        <label><input ref={(el) => { this.passRef = el }} placeholder="password" /></label> (hint: password1)<br />
        <button type="submit">login</button>
        {this.state.error && (
          <p>Bad login information</p>
        )}
      </form>
    )
  }

})

module.exports = withRouter(Login)
