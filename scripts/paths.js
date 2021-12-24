const path = require('path')
module.exports = {
  envFile: path.resolve(process.cwd(), '.env'),
  serverIndex: path.resolve(process.cwd(), './src/server/index.ts')
}