// React 18 compatible test helpers
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'

// Store root instances for cleanup
const roots = new WeakMap()

/**
 * React 18 compatible render function that maintains API compatibility
 * with React 17's render(element, container, callback) signature
 */
export function render(element, container, callback) {
  // Check if React 18 createRoot is available
  if (typeof createRoot === 'function') {
    // React 18: use createRoot
    let root = roots.get(container)
    if (!root) {
      root = createRoot(container)
      roots.set(container, root)
    }
    
    // Render the element synchronously using flushSync
    if (typeof callback === 'function') {
      // Use flushSync to ensure rendering completes before callback
      flushSync(() => {
        root.render(element)
      })
      // Use setTimeout to ensure DOM is fully updated
      setTimeout(callback, 0)
    } else {
      root.render(element)
    }
    
    return root
  } else {
    // Fallback to React 17 API (if somehow still using React 17)
    const ReactDOM = require('react-dom')
    ReactDOM.render(element, container, callback)
    return null
  }
}

/**
 * React 18 compatible unmount function
 */
export function unmountComponentAtNode(container) {
  const root = roots.get(container)
  if (root) {
    root.unmount()
    roots.delete(container)
    // Clear the container
    if (container) {
      container.innerHTML = ''
    }
  } else {
    // Fallback for React 17
    const ReactDOM = require('react-dom')
    ReactDOM.unmountComponentAtNode(container)
  }
}

