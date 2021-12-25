const createConfig = require('./createConfig')
const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const nodemon = require('nodemon')
const paths = require('./paths')
const path = require('path');
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

// serverCompiler.watch({
//   ignored: ['**/node_modules', `${path.resolve(process.cwd(), 'build')}/**`]
// }, (error, stats) => {
//   if (error !== undefined && !stats.hasErrors()) {
//     return console.log(`stats.toString(serverConf.stats)`)
//   }
//   if (error) {
//     console.log(error, 'error')
//   }

//   if (stats.hasErrors()) {
//     const info = stats.toJson()
//     try {
//       const errors = info.errors[0]?.split('\n')
//       errors.forEach((error) => {
//         console.log(error, 'error')
//       })
//     } catch {
//       console.log(info.errors[0], 'error')
//     }
//   }
// })

let devServer;
if (mode === 'dev') {
  devServer = new WebpackDevServer(clientConfig.devServer, clientCompiler)
  devServer.listen('8080')
  console.log(
    "Client is running " +
    chalk.green('https:// port')
  )
} else {
  // clientCompiler.run((err, stats) => {
  //   if (err) {
  //     throw err
  //   }
  // })
}

// clientCompiler.run((err, stats) => {
//   if (stats.hasErrors()) {
//     console.log(`stats.compilation.errors`)
//     process.exit(1)
//   }
// })
clientCompiler.hooks.done.tap('client', (stats) => {
  // serverCompiler.run((err, stats) => {
  //   err && console.log('server err', err)
  //   // if(stats.hasErrors()) {
  //   // }
  // })

  serverCompiler.watch({
    ignored: ['**/node_modules', `${path.resolve(process.cwd(), 'build')}/**`]
  }, (error, stats) => {
    if (error !== undefined && !stats.hasErrors()) {
      return console.log(`stats.toString(serverConf.stats)`)
    }
    if (error) {
      console.log(error, 'error')
    }

    if (stats.hasErrors()) {
      const info = stats.toJson()
      try {
        const errors = info.errors[0]?.split('\n')
        errors.forEach((error) => {
          console.log(error, 'error')
        })
      } catch {
        console.log(info.errors[0], 'error')
      }
    }
  })
  serverCompiler.hooks.done.tap('client', (stats) => {
    if (stats.hasErrors()) {
      console.log('server compile error..', stats.compilation.errors)
      process.exit(1)
    }
    console.log('start run nodemon')
    nodemon({
      script: path.resolve(process.cwd(), `build/server.js`),
      nodeArgs: ['--inspect'],
      // env: ''
      watch: [`${path.resolve(process.cwd(), `build/**`)}`]
    })
    console.log('server running..')
    nodemon.on('start', () => {
      console.log('nodemon start')
    })
    nodemon.on('crash', () => {
      console.log('nodemon crashed')
      // devServer.close(() => {
      //   // 服务关闭进行 unregister
      //   console.log(`The devServer is closed \n`)
      //   // unregister()
      // })
    })
    nodemon.on('quit', () => {
      console.log('nodemon quit')
      devServer.close(() => {
        // 服务关闭进行 unregister
        console.log(`The devServer is closed \n`)
        // unregister()
      })
    })
  })
})

// 进程退出进行 unregister
const processShutdownHandler = (name) => () => {
  console.log(`The process is ${name}\n`)
  // unregister()
  devServer.close(() => {
    // 服务关闭进行 unregister
    console.log(`The devServer is closed \n`)
    // unregister()
  })
}

process.on('SIGINT', processShutdownHandler('SIGINT'))
process.on('SIGTERM', processShutdownHandler('SIGTERM'))


// [clientCompiler, serverCompiler].forEach(compiler => {
//   compiler.plugin('done', (stats) => {
//     if (stats.compilation.errors && stats.compilation.errors.length) {
//       console.log(stats.compilation.errors)
//       process.exit(1)
//     }
//   })
// })
