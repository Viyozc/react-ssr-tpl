const createConfig = require('./createConfig')
const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const nodemon = require('nodemon')
const paths = require('./paths')
const mode = process.argv[2]
console.log(123, mode)
const clientConfig = createConfig(mode, 'web')
const serverConfig = createConfig(mode, 'node')

function compile(config) {
  let compiler;
  try {
    compiler = webpack(config)
  } catch (e) {
    console.log('failded to compile', e)
    process.exit(1)
  }
  return compiler
}

const clientCompiler = compile(clientConfig)
const serverCompiler = compile(serverConfig)


if (mode === 'dev') {
  const devServer = new WebpackDevServer(clientConfig.devServer, clientCompiler)
  devServer.listen('8080')
  console.log(
    "Client is running" +
    chalk.green('https:// port')
  )
} else {
  clientCompiler.run((err, stats) => {
    if (err) {
      throw err
    }
  })
}

clientCompiler.run((err, stats) => {
  clientCompiler.hooks.done.tap('done', (stats) => {
    if (stats.hasErrors) {
      
      // console.log(stats.compilation.errors)
      process.exit(1)
    }
    serverCompiler.run((err, stats) => {
      serverCompiler.hooks.done.tap('done', (stats) => {
        if (states.hasErrors()) {
          console.log('server compile error..')
          process.exit(1)
        }
        nodemon({
          script: paths.resolve(process.cwd(), `build/server.js`),
          nodeArgs: ['--inspect'],
          // env: ''
          watch: [`${paths.resolve(process.cwd(), `build/**`)}`]
        })
        console.log('server running..')
        nodemon.on('start', () => {
          console.log('nodemon start')
        })
        nodemon.on('crash', () => {
          console.log('nodemon crashed')
        })
        nodemon.on('quit', () => {
          console.log('nodemon quit')
        })
      })
    })
  })

})

// [clientCompiler, serverCompiler].forEach(compiler => {
//   compiler.plugin('done', (stats) => {
//     if (stats.compilation.errors && stats.compilation.errors.length) {
//       console.log(stats.compilation.errors)
//       process.exit(1)
//     }
//   })
// })
