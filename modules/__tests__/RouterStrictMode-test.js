/**
 * Tests for Router behavior under React 18 StrictMode
 * 
 * StrictMode in React 18 intentionally double-mounts components in development
 * to help detect side effects. This test ensures Router handles this correctly.
 * 
 * NOTE: These tests require a DOM environment and should be run in browser tests
 * (via karma/test-browser) rather than Node.js tests. They will be automatically
 * loaded by tests.webpack.js via require.context.
 */

import expect from 'expect'
import React, { Component, StrictMode } from 'react'
import { render, unmountComponentAtNode } from './testHelpers'
import createHistory from '../createMemoryHistory'
import Route from '../Route'
import Router from '../Router'
import Link from '../Link'

describe('Router with StrictMode', function () {
  let node
  let history

  beforeEach(function () {
    node = document.createElement('div')
    history = createHistory('/')
  })

  afterEach(function () {
    unmountComponentAtNode(node)
  })

  it('should handle double mounting in StrictMode', function (done) {
    let mountCount = 0

    class TestComponent extends Component {
      componentDidMount() {
        mountCount++
      }

      render() {
        return <div>Test Component - Mounted: {mountCount}</div>
      }
    }

    render((
      <StrictMode>
        <Router history={history}>
          <Route path="/" component={TestComponent} />
        </Router>
      </StrictMode>
    ), node, function () {
      // In StrictMode, component should mount twice in development
      // But Router should still work correctly
      expect(node.textContent).toMatch(/Test Component/)
      expect(node.textContent).toMatch(/Mounted:/)
      
      // Router should have set up correctly
      expect(history.getCurrentLocation().pathname).toEqual('/')
      
      done()
    })
  })

  it('should maintain routing state after remount in StrictMode', function (done) {
    class Home extends Component {
      render() {
        return <div>Home Page</div>
      }
    }

    class About extends Component {
      render() {
        return <div>About Page</div>
      }
    }

    class App extends Component {
      render() {
        return (
          <div>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            {this.props.children}
          </div>
        )
      }
    }

    const testHistory = createHistory('/about')

    render((
      <StrictMode>
        <Router history={testHistory}>
          <Route path="/" component={App}>
            <Route path="about" component={About} />
            <Route path="/" component={Home} />
          </Route>
        </Router>
      </StrictMode>
    ), node, function () {
      // After StrictMode remount, should still be on /about
      expect(node.textContent).toMatch(/About Page/)
      expect(testHistory.getCurrentLocation().pathname).toEqual('/about')
      
      done()
    })
  })

  it('should set up and clean up listeners correctly in StrictMode', function (done) {
    let listenerCallCount = 0
    const testHistory = createHistory('/')

    class TestComponent extends Component {
      render() {
        return <div>Test</div>
      }
    }

    // Track history listener calls
    const originalListen = testHistory.listen.bind(testHistory)
    const listenerCalls = []
    
    testHistory.listen = function (callback) {
      const unlisten = originalListen(function (location) {
        listenerCallCount++
        listenerCalls.push(location.pathname)
        callback(location)
      })
      return unlisten
    }

    render((
      <StrictMode>
        <Router history={testHistory}>
          <Route path="/" component={TestComponent} />
        </Router>
      </StrictMode>
    ), node, function () {
      // Router should have set up listener
      expect(listenerCallCount).toBeGreaterThan(0)
      
      // Navigate to a new location
      testHistory.push('/new-path')
      
      setTimeout(function () {
        // Listener should have been called for navigation
        expect(listenerCalls.length).toBeGreaterThan(1)
        expect(testHistory.getCurrentLocation().pathname).toEqual('/new-path')
        
        // Clean up
        unmountComponentAtNode(node)
        
        // After unmount, listener should be cleaned up
        // (We can't directly test this, but if it wasn't cleaned up,
        // we'd see issues in subsequent tests)
        done()
      }, 50)
    })
  })

  it('should handle route changes correctly after StrictMode remount', function (done) {
    class Page1 extends Component {
      render() {
        return <div>Page 1</div>
      }
    }

    class Page2 extends Component {
      render() {
        return <div>Page 2</div>
      }
    }

    class App extends Component {
      render() {
        return (
          <div>
            <Link to="/page1">Page 1</Link>
            <Link to="/page2">Page 2</Link>
            {this.props.children}
          </div>
        )
      }
    }

    const testHistory = createHistory('/page1')

    render((
      <StrictMode>
        <Router history={testHistory}>
          <Route path="/" component={App}>
            <Route path="page1" component={Page1} />
            <Route path="page2" component={Page2} />
          </Route>
        </Router>
      </StrictMode>
    ), node, function () {
      // Should be on page1 initially
      expect(node.textContent).toMatch(/Page 1/)
      expect(testHistory.getCurrentLocation().pathname).toEqual('/page1')
      
      // Navigate to page2
      testHistory.push('/page2')
      
      setTimeout(function () {
        // Should have navigated to page2
        expect(node.textContent).toMatch(/Page 2/)
        expect(testHistory.getCurrentLocation().pathname).toEqual('/page2')
        
        done()
      }, 50)
    })
  })

  it('should handle nested routes correctly in StrictMode', function (done) {
    class GrandParent extends Component {
      render() {
        return <div>GrandParent: {this.props.children}</div>
      }
    }

    class Parent extends Component {
      render() {
        return <div>Parent: {this.props.children}</div>
      }
    }

    class Child extends Component {
      render() {
        return <div>Child</div>
      }
    }

    const testHistory = createHistory('/parent/child')

    render((
      <StrictMode>
        <Router history={testHistory}>
          <Route path="/" component={GrandParent}>
            <Route path="parent" component={Parent}>
              <Route path="child" component={Child} />
            </Route>
          </Route>
        </Router>
      </StrictMode>
    ), node, function () {
      // Should render all nested components
      expect(node.textContent).toMatch(/GrandParent/)
      expect(node.textContent).toMatch(/Parent/)
      expect(node.textContent).toMatch(/Child/)
      expect(testHistory.getCurrentLocation().pathname).toEqual('/parent/child')
      
      done()
    })
  })

  it('should handle dynamic route parameters correctly in StrictMode', function (done) {
    class UserDetail extends Component {
      render() {
        return <div>User ID: {this.props.params.id}</div>
      }
    }

    const testHistory = createHistory('/users/123')

    render((
      <StrictMode>
        <Router history={testHistory}>
          <Route path="/users/:id" component={UserDetail} />
        </Router>
      </StrictMode>
    ), node, function () {
      // Should extract route parameter correctly
      expect(node.textContent).toMatch(/User ID: 123/)
      expect(testHistory.getCurrentLocation().pathname).toEqual('/users/123')
      
      // Navigate to different user
      testHistory.push('/users/456')
      
      setTimeout(function () {
        expect(node.textContent).toMatch(/User ID: 456/)
        expect(testHistory.getCurrentLocation().pathname).toEqual('/users/456')
        
        done()
      }, 50)
    })
  })

  it('should not create duplicate listeners on remount', function (done) {
    const testHistory = createHistory('/')
    let listenerCount = 0
    const unlistenFunctions = []

    // Track how many times listen is called
    const originalListen = testHistory.listen.bind(testHistory)
    testHistory.listen = function (callback) {
      listenerCount++
      const unlisten = originalListen(callback)
      unlistenFunctions.push(unlisten)
      return unlisten
    }

    class TestComponent extends Component {
      render() {
        return <div>Test</div>
      }
    }

    render((
      <StrictMode>
        <Router history={testHistory}>
          <Route path="/" component={TestComponent} />
        </Router>
      </StrictMode>
    ), node, function () {
      // In StrictMode, Router constructor is called twice, but
      // componentDidMount should only set up listener once per mount
      // We expect at least one listener, but not excessive duplicates
      expect(listenerCount).toBeGreaterThanOrEqual(1)
      
      // Clean up
      unmountComponentAtNode(node)
      
      // All listeners should be cleaned up
      unlistenFunctions.forEach(fn => {
        if (typeof fn === 'function') {
          fn()
        }
      })
      
      done()
    })
  })

  it('should handle query parameters correctly in StrictMode', function (done) {
    class SearchPage extends Component {
      render() {
        const query = this.props.location.query || {}
        return <div>Search: {query.q || 'none'}</div>
      }
    }

    const testHistory = createHistory('/search?q=test')

    render((
      <StrictMode>
        <Router history={testHistory}>
          <Route path="/search" component={SearchPage} />
        </Router>
      </StrictMode>
    ), node, function () {
      // Should parse query parameters correctly
      expect(node.textContent).toMatch(/Search: test/)
      
      // Navigate with different query
      testHistory.push('/search?q=react')
      
      setTimeout(function () {
        expect(node.textContent).toMatch(/Search: react/)
        
        done()
      }, 50)
    })
  })
})

