const path = require('path')
module.exports = {
  envFile: path.resolve(process.cwd(), '.env'),
  buildPath: path.resolve(process.cwd(), 'build'),
  serverIndex: path.resolve(process.cwd(), './src/server/index.ts')
}