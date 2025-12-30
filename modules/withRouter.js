import invariant from 'invariant'
import React, { Component } from 'react'
import { ForwardRef, Memo, isMemo } from 'react-is'
import { routerShape } from './PropTypes'
import { RouterContext as RouterContextProvider } from './RouterContextProvider'

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

/**
 * Hoist non-React static methods from sourceComponent to targetComponent
 * Based on hoist-non-react-statics implementation
 */
const REACT_STATICS = {
  childContextTypes: true,
  contextType: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  getDerivedStateFromError: true,
  getDerivedStateFromProps: true,
  mixins: true,
  propTypes: true,
  type: true
}

const KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
}

const FORWARD_REF_STATICS = {
  '$$typeof': true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
}

const MEMO_STATICS = {
  '$$typeof': true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
}

const TYPE_STATICS = {}
TYPE_STATICS[ForwardRef] = FORWARD_REF_STATICS
TYPE_STATICS[Memo] = MEMO_STATICS

function getStatics(component) {
  // React v16.11 and below
  if (isMemo(component)) {
    return MEMO_STATICS
  }

  // React v16.12 and above
  return TYPE_STATICS[component['$$typeof']] || REACT_STATICS
}

const defineProperty = Object.defineProperty
const getOwnPropertyNames = Object.getOwnPropertyNames
const getOwnPropertySymbols = Object.getOwnPropertySymbols
const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor
const getPrototypeOf = Object.getPrototypeOf
const objectPrototype = Object.prototype

function hoistStatics(targetComponent, sourceComponent, excludelist) {
  if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components

    if (objectPrototype) {
      const inheritedComponent = getPrototypeOf(sourceComponent)
      if (inheritedComponent && inheritedComponent !== objectPrototype) {
        hoistStatics(targetComponent, inheritedComponent, excludelist)
      }
    }

    let keys = getOwnPropertyNames(sourceComponent)

    if (getOwnPropertySymbols) {
      keys = keys.concat(getOwnPropertySymbols(sourceComponent))
    }

    const targetStatics = getStatics(targetComponent)
    const sourceStatics = getStatics(sourceComponent)

    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i]
      if (!KNOWN_STATICS[key] &&
          !(excludelist && excludelist[key]) &&
          !(sourceStatics && sourceStatics[key]) &&
          !(targetStatics && targetStatics[key])
      ) {
        const descriptor = getOwnPropertyDescriptor(sourceComponent, key)
        try { // Avoid failures from read-only properties
          defineProperty(targetComponent, key, descriptor)
        } catch (e) {
          // Ignore errors when copying (e.g., read-only properties)
        }
      }
    }
  }

  return targetComponent
}

export default function withRouter(WrappedComponent, options) {
  const withRef = options && options.withRef

  class WithRouter extends Component {
    static displayName = 'WithRouter'
    static propTypes = { router: routerShape }

    getWrappedInstance() {
      invariant(
        withRef,
        'To access the wrapped instance, you need to specify ' +
        '`{ withRef: true }` as the second argument of the withRouter() call.'
      )

      return this.wrappedInstance
    }

    render() {
      // Use new Context API (React.createContext)
      return (
        <RouterContextProvider.Consumer>
          {routerFromContext => {
            // Get router from new Context API, fallback to props if provided
            const router = this.props.router || routerFromContext
            
            if (!router) {
              return <WrappedComponent {...this.props} />
            }

            const { params, location, routes } = router
            const props = { ...this.props, router, params, location, routes }

            if (withRef) {
              props.ref = (c) => { this.wrappedInstance = c }
            }

            return <WrappedComponent {...props} />
          }}
        </RouterContextProvider.Consumer>
      )
    }
  }

  WithRouter.displayName = `withRouter(${getDisplayName(WrappedComponent)})`
  WithRouter.WrappedComponent = WrappedComponent

  return hoistStatics(WithRouter, WrappedComponent)
}
