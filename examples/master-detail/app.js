import React, { Component } from 'react'
import { render } from '../renderHelper'
import { browserHistory, Router, Route, IndexRoute, Link, withRouter } from 'react-router'

import withExampleBasename from '../withExampleBasename'
import ContactStore from './ContactStore'

import './app.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contacts: ContactStore.getContacts(),
      loading: true
    }
    this.updateContacts = this.updateContacts.bind(this)
  }

  componentDidMount() {
    ContactStore.init()
    ContactStore.addChangeListener(this.updateContacts)
  }

  componentWillUnmount() {
    ContactStore.removeChangeListener(this.updateContacts)
  }

  updateContacts() {
    this.setState({
      contacts: ContactStore.getContacts(),
      loading: false
    })
  }

  render() {
    const contacts = this.state.contacts.map(function (contact) {
      return <li key={contact.id}><Link to={`/contact/${contact.id}`}>{contact.first}</Link></li>
    })

    return (
      <div className="App">
        <div className="ContactList">
          <Link to="/contact/new">New Contact</Link>
          <ul>
            {contacts}
          </ul>
        </div>
        <div className="Content">
          {this.props.children}
        </div>
      </div>
    )
  }
}

class Index extends Component {
  render() {
    return <h1>Address Book</h1>
  }
}

class Contact extends Component {
  constructor(props) {
    super(props)
    this.state = this.getStateFromStore()
    this.updateContact = this.updateContact.bind(this)
    this.destroy = this.destroy.bind(this)
  }

  getStateFromStore(props) {
    const { id } = props ? props.params : this.props.params

    return {
      contact: ContactStore.getContact(id)
    }
  }

  componentDidMount() {
    ContactStore.addChangeListener(this.updateContact)
  }

  componentWillUnmount() {
    ContactStore.removeChangeListener(this.updateContact)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.params.id !== this.props.params.id) {
      this.setState(this.getStateFromStore())
    }
  }

  updateContact() {
    this.setState(this.getStateFromStore())
  }

  destroy() {
    const { id } = this.props.params
    ContactStore.removeContact(id)
    this.props.router.push('/')
  }

  render() {
    const contact = this.state.contact || {}
    const name = contact.first + ' ' + contact.last
    const avatar = contact.avatar || 'http://placecage.com/50/50'

    return (
      <div className="Contact">
        <img height="50" src={avatar} key={avatar} />
        <h3>{name}</h3>
        <button onClick={this.destroy}>Delete</button>
      </div>
    )
  }
}

class NewContact extends Component {
  constructor(props) {
    super(props)
    this.createContact = this.createContact.bind(this)
  }

  createContact(event) {
    event.preventDefault()

    ContactStore.addContact({
      first: this.firstRef.value,
      last: this.lastRef.value
    }, (contact) => {
      this.props.router.push(`/contact/${contact.id}`)
    })
  }

  render() {
    return (
      <form onSubmit={this.createContact}>
        <p>
          <input type="text" ref={(el) => { this.firstRef = el }} placeholder="First name" />
          <input type="text" ref={(el) => { this.lastRef = el }} placeholder="Last name" />
        </p>
        <p>
          <button type="submit">Save</button> <Link to="/">Cancel</Link>
        </p>
      </form>
    )
  }
}

class NotFound extends Component {
  render() {
    return <h2>Not found</h2>
  }
}

const ContactWithRouter = withRouter(Contact)
const NewContactWithRouter = withRouter(NewContact)

render((
  <Router history={withExampleBasename(browserHistory, __dirname)}>
    <Route path="/" component={App}>
      <IndexRoute component={Index} />
      <Route path="contact/new" component={NewContactWithRouter} />
      <Route path="contact/:id" component={ContactWithRouter} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
), document.getElementById('example'))
