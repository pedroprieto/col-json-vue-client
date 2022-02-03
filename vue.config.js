'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {

  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: false,
      },
      '/assets': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: false,
      },
    },
  }
}
