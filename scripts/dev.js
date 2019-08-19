const config = require('./base')
const merge = require('webpack-merge')

module.exports = merge(config, {
    mode: 'development'
})