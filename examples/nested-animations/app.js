/*
 * @Author: chengshuping 13816983864@163.com
 * @Date: 2019-08-24 01:23:36
 * @LastEditors: chengshuping 13816983864@163.com
 * @LastEditTime: 2025-12-30 10:18:21
 * @FilePath: /react-router-3.2.4/examples/nested-animations/app.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { render } from '../renderHelper'
import { browserHistory, Router, Route, Link } from 'react-router'

import withExampleBasename from '../withExampleBasename'

import './app.css'

const App = ({ children, location: { pathname } }) => {
  // Only take the first-level part of the path as key, instead of the whole path.
  const key = pathname.split('/')[1] || 'root'
  const nodeRef = React.useRef(null)

  return (
    <div>
      <ul>
        <li><Link to="/page1">Page 1</Link></li>
        <li><Link to="/page2">Page 2</Link></li>
      </ul>
      <TransitionGroup component="div">
        <CSSTransition
          key={key}
          nodeRef={nodeRef}
          timeout={500}
          classNames="swap"
          unmountOnExit
        >
          <div ref={nodeRef}>
            {children || <div />}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}

const Page1 = ({ children, location: { pathname } }) => {
  const nodeRef = React.useRef(null)
  
  return (
    <div className="Image">
      <h1>Page 1</h1>
      <ul>
        <li><Link to="/page1/tab1">Tab 1</Link></li>
        <li><Link to="/page1/tab2">Tab 2</Link></li>
      </ul>
      <TransitionGroup component="div">
        <CSSTransition
          key={pathname}
          nodeRef={nodeRef}
          timeout={500}
          classNames="example"
          unmountOnExit
        >
          <div ref={nodeRef}>
            {children || <div/>}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}

const Page2 = ({ children, location: { pathname } }) => {
  const nodeRef = React.useRef(null)
  
  return (
    <div className="Image">
      <h1>Page 2</h1>
      <ul>
        <li><Link to="/page2/tab1">Tab 1</Link></li>
        <li><Link to="/page2/tab2">Tab 2</Link></li>
      </ul>
      <TransitionGroup component="div">
        <CSSTransition
          key={pathname}
          nodeRef={nodeRef}
          timeout={500}
          classNames="example"
          unmountOnExit
        >
          <div ref={nodeRef}>
            {children || <div/>}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}

const Tab1 = () => (
  <div className="Image">
    <h2>Tab 1</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  </div>
)

const Tab2 = () => (
  <div className="Image">
    <h2>Tab 2</h2>
    <p>Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  </div>
)

render((
  <Router history={withExampleBasename(browserHistory, __dirname)}>
    <Route path="/" component={App}>
      <Route path="page1" component={Page1}>
        <Route path="tab1" component={Tab1} />
        <Route path="tab2" component={Tab2} />
      </Route>
      <Route path="page2" component={Page2}>
        <Route path="tab1" component={Tab1} />
        <Route path="tab2" component={Tab2} />
      </Route>
    </Route>
  </Router>
), document.getElementById('example'))
