import React, { Component } from 'react'
import { render } from '../renderHelper'
import { browserHistory, Router, Route, Link, withRouter } from 'react-router'

import withExampleBasename from '../withExampleBasename'

class App extends Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/dashboard" activeClassName="active">Dashboard</Link></li>
          <li><Link to="/form" activeClassName="active">Form</Link></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
}

class Dashboard extends Component {
  render() {
    return <h1>Dashboard</h1>
  }
}

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      textValue: 'ohai'
    }
    this.routerWillLeave = this.routerWillLeave.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.props.router.setRouteLeaveHook(
      this.props.route,
      this.routerWillLeave
    )
  }

  routerWillLeave() {
    if (this.state.textValue)
      return 'You have unsaved information, are you sure you want to leave this page?'
  }

  handleChange(event) {
    this.setState({
      textValue: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault()

    this.setState({
      textValue: ''
    }, () => {
      this.props.router.push('/')
    })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <p>Click the dashboard link with text in the input.</p>
          <input type="text" ref={(el) => { this.userInputRef = el }} value={this.state.textValue} onChange={this.handleChange} />
          <button type="submit">Go</button>
        </form>
      </div>
    )
  }
}

const FormWithRouter = withRouter(Form)

render((
  <Router history={withExampleBasename(browserHistory, __dirname)}>
    <Route path="/" component={App}>
      <Route path="dashboard" component={Dashboard} />
      <Route path="form" component={FormWithRouter} />
    </Route>
  </Router>
), document.getElementById('example'))
