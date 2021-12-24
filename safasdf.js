const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin }  = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackBar = require('webpackbar')

const babelOption = require('./babel.config')

module.exports = {
  mode: 'development',
  devtool: 'cheap-source-map',
  entry: './src/index',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, "build")
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WebpackBar({
      name: 'client',
      color: 'red'
    }),
    new HtmlWebpackPlugin({
      title: "hello world",
      template: './src/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        include: [path.resolve(__dirname, './src')],
        loader: "babel-loader",
        options: babelOption,
      },
      {
        test: /\.(css|less)$/,
        use: [
          "style-loader",
          "css-loader",
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
  },
  
}