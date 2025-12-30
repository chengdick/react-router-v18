# React Router v18

<img src="/logo/vertical@2x.png" height="150"/>

**React Router v18** is a fork of [React Router 3.2.4](https://github.com/ReactTraining/react-router/tree/v3.2.4) upgraded to support **React 16.3+, 17, 18, and 19**.

React Router is a complete routing library for [React](https://facebook.github.io/react). It keeps your UI in sync with the URL with a simple API and powerful features like lazy code loading, dynamic route matching, and location transition handling built right in.

## 🎯 Key Features

- ✅ **React 18/19 Compatible** - Full support for React 16.3+, 17, 18, and 19
- ✅ **Modern Context API** - Uses `React.createContext()` instead of legacy context
- ✅ **Updated Lifecycle Methods** - Removed deprecated `componentWillMount` and `componentWillReceiveProps`
- ✅ **No Deprecation Warnings** - All React 18 warnings resolved
- ✅ **Backward Compatible** - Maintains React Router 3.2.4 API compatibility

## 🚀 Live Demo

View live examples on GitHub Pages:

**[👉 View All Examples](https://chengdick.github.io/react-router-v18/)**

Examples include:
- Active Links
- Animations
- Auth Flow
- Master Detail
- Pinterest-style UI
- And more...

## 📚 Documentation

- **[Upgrade Documentation](./UPGRADE_TO_REACT_18.md)** - Complete guide to React 18/19 upgrade changes
- **[Quick Reference](./CHANGES_SUMMARY.md)** - Quick summary of changes
- [Original React Router 3.2.4 Docs](/docs) - API documentation (still applicable)
- [Examples](/examples) - Working examples with React 18
- [Stack Overflow](http://stackoverflow.com/questions/tagged/react-router) - Community support

## ⚙️ React Version Support

This version supports:
- **React 16.3+** (requires `React.createContext()`)
- **React 17**
- **React 18**
- **React 19**

> **Note:** React 0.14, 15, and 16.0-16.2 are not supported due to the use of `React.createContext()` which was introduced in React 16.3.

## 🔄 Migration from React Router 3.2.4

If you're upgrading from the original React Router 3.2.4, see the [UPGRADE_TO_REACT_18.md](./UPGRADE_TO_REACT_18.md) for detailed migration guide. The API remains compatible, but internal implementation has been updated for React 18/19.

### Browser Support

We support all browsers and environments where React runs.

## 📦 Installation

Using [npm](https://www.npmjs.com/):

```bash
npm install --save react-router-v18
```

Or using [yarn](https://yarnpkg.com/):

```bash
yarn add react-router-v18
```

Then with a module bundler like [webpack](https://webpack.github.io/) that supports either CommonJS or ES2015 modules:

```js
// using an ES6 transpiler, like babel
import { Router, Route, Link, browserHistory } from 'react-router-v18'

// not using an ES6 transpiler
var Router = require('react-router-v18').Router
var Route = require('react-router-v18').Route
var Link = require('react-router-v18').Link
var browserHistory = require('react-router-v18').browserHistory
```

## 💡 Usage Example

### React 18 Function Components (Recommended)

```js
import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Router, Route, Link, browserHistory } from 'react-router-v18'

// Function component with hooks
const App = ({ children }) => (
  <div>
    <h1>App</h1>
    <nav>
      <Link to="/about">About</Link>
      <Link to="/users">Users</Link>
    </nav>
    {children}
  </div>
)

const About = () => (
  <div>
    <h2>About</h2>
    <p>This is the about page.</p>
  </div>
)

const Users = ({ children }) => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    // Fetch users data
    fetchUsers().then(setUsers)
  }, [])

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <Link to={`/user/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
      {children}
    </div>
  )
}

const User = ({ params }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Route components receive params as props
    findUserById(params.userId).then(setUser)
  }, [params.userId])

  if (!user) return <div>Loading...</div>

  return (
    <div>
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
    </div>
  )
}

// React 18 rendering with createRoot
const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="about" component={About}/>
      <Route path="users" component={Users}>
        <Route path="/user/:userId" component={User}/>
      </Route>
    </Route>
  </Router>
)
```

### Using createReactClass (Still Supported)

If you prefer the class-based API, you can still use `create-react-class`:

```js
import React from 'react'
import createReactClass from 'create-react-class'
import { createRoot } from 'react-dom/client'
import { Router, Route, Link, browserHistory } from 'react-router-v18'

const App = createReactClass({
  render() {
    return (
      <div>
        <h1>App</h1>
        <nav>
          <Link to="/about">About</Link>
          <Link to="/users">Users</Link>
        </nav>
        {this.props.children}
      </div>
    )
  }
})

// ... rest of components

// React 18 rendering with createRoot
const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="about" component={About}/>
    </Route>
  </Router>
)
```

> **Note:** 
> - For React 18+, use `createRoot` from `react-dom/client` instead of `ReactDOM.render`
> - Function components with hooks are recommended for new code
> - `createReactClass` is still supported for backward compatibility
> - See [UPGRADE_TO_REACT_18.md](./UPGRADE_TO_REACT_18.md) for complete migration details

See more examples in the [Examples](/examples) directory.

## 🏗️ Based on React Router 3.2.4

This project is a fork of [React Router 3.2.4](https://github.com/ReactTraining/react-router/tree/v3.2.4) with upgrades for React 18/19 compatibility. The core API remains the same, making it a drop-in replacement for projects using React Router 3.2.4 with React 16.3+.

## 📋 What Changed?

- ✅ Migrated from legacy Context API to `React.createContext()`
- ✅ Removed deprecated lifecycle methods (`componentWillMount`, `componentWillReceiveProps`)
- ✅ Updated rendering API for React 18 (`createRoot` instead of `ReactDOM.render`)
- ✅ Fixed string ref warnings (using callback refs)
- ✅ Updated animation examples to use `react-transition-group` v4+ API
- ✅ Removed all React 18 deprecation warnings

See [UPGRADE_TO_REACT_18.md](./UPGRADE_TO_REACT_18.md) for complete details.

## 🔗 Links

- **Repository**: [https://github.com/chengdick/react-router-v18](https://github.com/chengdick/react-router-v18)
- **Original React Router**: [https://github.com/ReactTraining/react-router](https://github.com/ReactTraining/react-router)
- **Issues**: [https://github.com/chengdick/react-router-v18/issues](https://github.com/chengdick/react-router-v18/issues)

## 📄 License

MIT - Same as the original React Router 3.2.4

## ⚠️ Disclaimer

**免责声明 / Disclaimer**

This is a community-maintained fork of React Router 3.2.4. The original authors and maintainers of React Router are not responsible for this fork or any issues that may arise from using it.

**Use at your own risk.** The maintainers of this fork are not liable for any damages, data loss, or issues that may occur from using this software.

If you use this code, you acknowledge that:
- This is a modified version of the original React Router
- The original authors are not associated with this fork
- You are using this software at your own risk
- The maintainers of this fork are not responsible for any consequences

---

这是一个社区维护的 React Router 3.2.4 分支版本。React Router 的原始作者和维护者不对此分支或使用它可能出现的任何问题负责。

**使用风险自负。** 此分支的维护者不对使用本软件可能造成的任何损害、数据丢失或问题承担责任。

如果您使用此代码，即表示您承认：
- 这是原始 React Router 的修改版本
- 原始作者与此分支无关
- 您使用本软件的风险由您自行承担
- 此分支的维护者不对任何后果负责

## 🙏 Credits

- Original React Router by [ReactTraining](https://github.com/ReactTraining)
- React Router was initially inspired by Ember's fantastic router
- This fork maintains compatibility with React Router 3.2.4 API while adding React 18/19 support
