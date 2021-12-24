const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssPlugin = require('mini-css-extract-plugin')
const WebpackBar = require('webpackbar')

const babelRc = require(path.resolve(process.cwd(), 'babel.config'))
// const { devtool } = require('../webpack.config')
const getConfig = (mode, target = 'web') => {
  const isNode = target === 'node';
  const isDev = mode === 'dev';
  const isProd = !isDev;
  const config = {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? "source-map" : "cheap-module-source-map",
    // context: process.cwd(),
    output: {
      filename: 'static/main.js',
      path: path.resolve(process.cwd(), 'build')
    },
    entry: path.resolve(process.cwd(), 'src/client/index'),
    plugins: [
      isProd && new CleanWebpackPlugin(),
      isProd && new MiniCssPlugin({
        filename: 'static/css/bundle.[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8.css'
      }),
      new WebpackBar({
        name: 'client',
        color: 'red'
      }),
      new HtmlWebpackPlugin({
        title: 'hello',
        template: path.resolve(process.cwd(), 'src/index.html')
      })
    ].filter(Boolean),
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          include: [path.resolve(process.cwd(), 'src')],
          loader: "babel-loader",
          options: babelRc,
        },
        {
          test: /\.(css|less)$/,
          use: [
            isDev ? "style-loader" : MiniCssPlugin.loader,
            "css-loader",
            "postcss-loader",
            "less-loader"
          ]
        },
        {
          test: /\.png$/,
          use: [
            "file-loader"
          ]
        }
      ]
    }
  }

  if (isDev) {
    config.devServer = {
      client: {
        overlay: true,
      },
      // contentBase: path.join(__dirname, 'build'),
      // watchOptions: {
      //   ignored: /node_modules/
      // },
      // noInfo: true,
      // sockHost: config.HOST,
      // sockPort: config.PORT

    }
  }

  return config;

}

module.exports = getConfig