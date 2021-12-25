const dotenv = require('dotenv')
const fs = require('fs')
const paths = require('./paths')

const NODE_ENV = process.env.NODE_ENV || "development"

const { envFile } = paths

const dotenvFiles = [
  envFile,
  `${envFile}.locale`,
  `${envFile}.${NODE_ENV}`,
  `${envFile}.${NODE_ENV}.local`,
]

const config = dotenvFiles.reduce((last, file) => {
  if(!fs.existsSync(file)) return last;
  return {...last, ...dotenv.parse(fs.readFileSync(file))}
}, {})

module.exports = {
  PORT: config.PORT || '8080',
  HOST: config.HOST || 'localhost',
  PUBLIC_PATH: config.PUBLIC_PATH  || `${config.HOST}:${config.PORT}`
}