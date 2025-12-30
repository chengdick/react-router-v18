// React 18 compatible Router Context using React.createContext()
import React from 'react'

// Create the router context
export const RouterContext = React.createContext(null)

// Default value for when context is not available
RouterContext.displayName = 'RouterContext'

