const express = require('express')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_END !== 'production'

    this.middlewares()
    this.routes()
  }

  middlewares () {
    this.express.use(express.json())
  }

  routes () {
    this.express.use(require('./routes'))
  }
}

module.exports = new App().express
