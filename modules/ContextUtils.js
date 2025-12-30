import React from 'react'
import PropTypes from 'prop-types'

// Works around issues with context updates failing to propagate.
// Caveat: the context value is expected to never change its identity.
// https://github.com/facebook/react/issues/2517
// https://github.com/reactjs/react-router/issues/470

const contextProviderShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  eventIndex: PropTypes.number.isRequired
})

function makeContextName(name) {
  return `@@contextSubscriber/${name}`
}

export function ContextProvider(name) {
  const contextName = makeContextName(name)
  const listenersKey = `${contextName}/listeners`
  const eventIndexKey = `${contextName}/eventIndex`
  const subscribeKey = `${contextName}/subscribe`

  const config = {
    // Legacy context API - kept for backward compatibility but deprecated
    // This is used for internal subscription mechanism to handle context updates
    childContextTypes: {
      [contextName]: contextProviderShape.isRequired
    },

    getChildContext() {
      // Initialize on first access if not already initialized
      // This replaces componentWillMount logic
      if (this[listenersKey] === undefined) {
        this[listenersKey] = []
        this[eventIndexKey] = 0
      }

      return {
        [contextName]: {
          eventIndex: this[eventIndexKey],
          subscribe: this[subscribeKey]
        }
      }
    },

    componentDidMount() {
      // Ensure initialization (in case getChildContext wasn't called yet)
      if (this[listenersKey] === undefined) {
        this[listenersKey] = []
        this[eventIndexKey] = 0
      }
    },

    componentDidUpdate(prevProps) {
      // Moved from componentWillReceiveProps - increment eventIndex on updates
      // This ensures context subscribers are notified of changes
      // Note: componentDidUpdate is called after render, so we increment here
      // and notify listeners, similar to the original componentWillReceiveProps + componentDidUpdate behavior
      if (prevProps !== this.props) {
        this[eventIndexKey]++
      }

      // Notify listeners after update (original componentDidUpdate logic)
      if (this[listenersKey]) {
        this[listenersKey].forEach(listener =>
          listener(this[eventIndexKey])
        )
      }
    },

    [subscribeKey](listener) {
      // No need to immediately call listener here.
      if (!this[listenersKey]) {
        this[listenersKey] = []
      }
      this[listenersKey].push(listener)

      return () => {
        if (this[listenersKey]) {
          this[listenersKey] = this[listenersKey].filter(item =>
            item !== listener
          )
        }
      }
    }
  }

  return config
}

export function ContextSubscriber(name) {
  const contextName = makeContextName(name)
  const lastRenderedEventIndexKey = `${contextName}/lastRenderedEventIndex`
  const handleContextUpdateKey = `${contextName}/handleContextUpdate`
  const unsubscribeKey = `${contextName}/unsubscribe`

  const config = {
    // Legacy context API - kept for backward compatibility but deprecated
    // This is used for internal subscription mechanism to handle context updates
    contextTypes: {
      [contextName]: contextProviderShape
    },

    getInitialState() {
      if (!this.context[contextName]) {
        return {}
      }

      return {
        [lastRenderedEventIndexKey]: this.context[contextName].eventIndex
      }
    },

    componentDidMount() {
      if (!this.context[contextName]) {
        return
      }

      this[unsubscribeKey] = this.context[contextName].subscribe(
        this[handleContextUpdateKey]
      )
    },

    componentDidUpdate(prevProps, prevState) {
      // Moved from componentWillReceiveProps - update state when context changes
      if (!this.context[contextName]) {
        return
      }

      const currentEventIndex = this.context[contextName].eventIndex
      const lastRenderedIndex = this.state[lastRenderedEventIndexKey]

      if (currentEventIndex !== lastRenderedIndex) {
        this.setState({
          [lastRenderedEventIndexKey]: currentEventIndex
        })
      }
    },

    componentWillUnmount() {
      if (!this[unsubscribeKey]) {
        return
      }

      this[unsubscribeKey]()
      this[unsubscribeKey] = null
    },

    [handleContextUpdateKey](eventIndex) {
      if (eventIndex !== this.state[lastRenderedEventIndexKey]) {
        this.setState({ [lastRenderedEventIndexKey]: eventIndex })
      }
    }
  }

  return config
}
