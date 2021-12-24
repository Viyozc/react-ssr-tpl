const createConfig = require('./createConfig')
const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const mode = process.argv[2]
console.log(123, mode)
const clientConfig = createConfig(mode)

function compile(config) {
  let compiler;
  try {
    compiler = webpack(config)
  } catch (e) {
    // console.log('failded to compile', e)
    process.exit(1)
  }
  return compiler
}

const compiler = compile(clientConfig)


if (mode === 'dev') {
  const devServer = new WebpackDevServer(clientConfig.devServer, compiler)
  devServer.listen('8080')
} else {
  compiler.run((err, stats) => {
    if (err) {
      throw err
    }
  })
}
// compiler.plugin('done', (stats) => {
//   if (stats.compilation.errors && stats.compilation.errors.length) {
//     // console.log(stats.compilation.errors)
//     process.exit(1)
//   }
// })
