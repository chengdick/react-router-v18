// React 18 compatible render helper for examples
import { createRoot } from 'react-dom/client'

// Store root instances for each container to avoid creating multiple roots
const roots = new WeakMap()

/**
 * React 18 compatible render function
 * Replaces ReactDOM.render(element, container) with createRoot API
 */
export function render(element, container) {
  if (!container) {
    throw new Error('Container is required')
  }

  // Check if React 18 createRoot is available
  if (typeof createRoot === 'function') {
    // React 18: use createRoot
    // Reuse existing root if available, otherwise create a new one
    let root = roots.get(container)
    if (!root) {
      root = createRoot(container)
      roots.set(container, root)
    }
    root.render(element)
    return root
  } else {
    // Fallback to React 17 API (if somehow still using React 17)
    const ReactDOM = require('react-dom')
    ReactDOM.render(element, container)
    return null
  }
}

// findDOMNode has been removed - use refs instead

