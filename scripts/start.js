const createConfig = require('./createConfig')
const chalk = require('chalk')
const webpack =  require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const mode = process.argv[2]
const clientConfig = createConfig(mode)