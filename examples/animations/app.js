/*
 * @Author: chengshuping 13816983864@163.com
 * @Date: 2019-08-24 01:23:36
 * @LastEditors: chengshuping 13816983864@163.com
 * @LastEditTime: 2025-12-30 10:18:58
 * @FilePath: /react-router-3.2.4/examples/animations/app.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { render } from '../renderHelper'
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router'

import withExampleBasename from '../withExampleBasename'

import './app.css'

const App = ({ children, location }) => {
  // Create a ref for the CSSTransition node to avoid findDOMNode warning
  const nodeRef = React.useRef(null)
  
  return (
    <div>
      <ul>
        <li><Link to="/page1">Page 1</Link></li>
        <li><Link to="/page2">Page 2</Link></li>
      </ul>

      <TransitionGroup component="div">
        <CSSTransition
          key={location.pathname}
          nodeRef={nodeRef}
          timeout={500}
          classNames="example"
          unmountOnExit
        >
          <div ref={nodeRef}>
            {children}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}

const Index = () => (
  <div className="Image">
    <h1>Index</h1>
    <p>Animations with React Router are not different than any other animation.</p>
  </div>
)

const Page1 = () => (
  <div className="Image">
    <h1>Page 1</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  </div>
)

const Page2 = () => (
  <div className="Image">
    <h1>Page 2</h1>
    <p>Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  </div>
)

render((
  <Router history={withExampleBasename(browserHistory, __dirname)}>
    <Route path="/" component={App}>
      <IndexRoute component={Index}/>
      <Route path="page1" component={Page1} />
      <Route path="page2" component={Page2} />
    </Route>
  </Router>
), document.getElementById('example'))
