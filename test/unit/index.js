// require all test files
const testsContext = require.context('src', true, /\.test.js$/)
testsContext.keys().forEach(testsContext)
