const path = require('path')
const paths = require('./paths');
const webpack = require('webpack')
const nodeExternals = require("webpack-node-externals");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssPlugin = require('mini-css-extract-plugin')
const AssetsWebpackPlugin = require('assets-webpack-plugin')
const WebpackBar = require('webpackbar')

const rootPath = process.cwd();
const srcRoot = path.join(rootPath, 'src')
const clientRoot = path.join(srcRoot, 'client')
const serverRoot = path.join(srcRoot, 'server')

const babelRc = require(path.resolve(process.cwd(), 'babel.config'))
// const { devtool } = require('../webpack.config')
const getConfig = (mode, target = 'web') => {
  console.log('process.env.PUBLIC_PATH: ', process.env.PUBLIC_PATH)
  const isNode = target === 'node';
  const isDev = mode === 'dev';
  const isProd = !isDev;
  const config = {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? "source-map" : "cheap-module-source-map",
    // context: process.cwd(),
    target: isNode ? 'node' : 'web',
    output: {
      publicPath: process.env.PUBLIC_PATH,
      filename: 'static/[name].js',
      path: path.resolve(process.cwd(), 'build')
    },
    entry: path.resolve(process.cwd(), 'src/client/index'),
    plugins: [
      isProd && new CleanWebpackPlugin(),
      (!isNode && isProd) && new MiniCssPlugin({
        filename: 'static/css/[name].bundle.[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8.css'
      }),
      !isNode && new AssetsWebpackPlugin({
        path: paths.buildPath,
        filename: "assets.json",
      }),
      new WebpackBar({
        name: !isNode ? "client" : "server",
        color: isNode ? "red" : "green",
      }),
      !isNode && new HtmlWebpackPlugin({
        title: 'hello',
        template: path.resolve(process.cwd(), 'src/client/index.html')
      }),
      new webpack.DefinePlugin({
        __IS_SERVER__: JSON.stringify(isNode)
      })
    ].filter(Boolean),
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      alias: {
        '@': srcRoot,
        '@client': clientRoot,
        '@server': serverRoot,
        // ...(isEnvProductionProfile && {
        //   'react-dom$': 'react-dom/profiling',
        //   'scheduler/tracing': 'scheduler/tracing-profiling',
        // })
      }
    },

    stats: {
      assets: false,
      cached: false,
      cachedAssets: false,
      chunks: false,
      chunkModules: false,
      children: false,
      colors: true,
      hash: false,
      modules: false,
      performance: false,
      reasons: false,
      timings: true,
      version: false
    },
    node: {
      __dirname: false
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
            !isNode && (isDev ? 'style-loader' : MiniCssPlugin.loader),
            "css-loader",
            "postcss-loader",
            "less-loader"
          ].filter(Boolean)
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

  if (!isNode) {
    config.optimization = {
      splitChunks: {
        automaticNameDelimiter: "_",
        cacheGroups: {
          vendor: {
            chunks: "initial", // 同步
            test: /\/node_modules\//,
            name: "vendors",
          },
        },
      },
    };
  }

  if (isDev) {
    config.devServer = {
      client: {
        overlay: true,
      },
      hot: true,
      // contentBase: path.join(__dirname, 'build'),
      // watchOptions: {
      //   ignored: /node_modules/
      // },
      // noInfo: true,
      // sockHost: config.HOST,
      // sockPort: config.PORT

    }
  }

  if (isNode) {
    config.entry = [paths.serverIndex];
    config.output = Object.assign(config.output, {
      path: path.resolve(process.cwd(), './build'),
      filename: "server.js",
      libraryTarget: "commonjs2",
    });
    config.externals = [
      nodeExternals({
        allowlist: [
          isDev ? "webpack/hot/poll?300" : null,
          /\.(eot|woff|woff2|ttf|otf)$/,
          /\.(svg|png|jpg|jpeg|gif|ico)$/,
          /\.(mp4|mp3|ogg|swf|webp)$/,
          /\.(css|scss|sass|sss|less)$/,
        ].filter(Boolean),
      }),
    ];
  }

  return config;

}

module.exports = getConfig