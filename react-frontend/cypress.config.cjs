const { defineConfig } = require('cypress')

console.log(process.env)

module.exports = defineConfig({
  e2e: {
    baseUrl: `http://localhost:${process.env.PORT}`,
  },
})
