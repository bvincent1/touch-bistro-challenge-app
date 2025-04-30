const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: `http://localhost:${process.env.PORT}`,
    apiUrl: process.env.VITE_API_URL,
  },
})
