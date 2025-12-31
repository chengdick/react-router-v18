global.__DEV__ = true

require('./modules/__tests__/serverRendering-test')
// Note: RouterStrictMode-test requires DOM environment and should be run via test-browser
// It will be automatically loaded by tests.webpack.js
