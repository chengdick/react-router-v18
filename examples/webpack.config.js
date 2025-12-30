/*eslint-disable no-var */

var fs = require('fs')
var path = require('path')
var webpack = require('webpack')

module.exports = {

  devtool: 'inline-source-map',

  entry: fs.readdirSync(__dirname).reduce(function (entries, dir) {
    if (fs.statSync(path.join(__dirname, dir)).isDirectory())
      entries[dir] = path.join(__dirname, dir, 'app.js')

    return entries
  }, {}),

  output: {
    path: __dirname + '/__build__',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    // 从环境变量或 package.json 获取基础路径
    publicPath: (function () {
      var basePath = process.env.GITHUB_PAGES_BASE_PATH || ''
      if (basePath && basePath !== '/') {
        basePath = basePath.replace(/\/$/, '')
        return basePath + '/__build__/'
      }
      return '/__build__/'
    })()
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.css$/, loader: 'style!css' }
    ]
  },

  resolve: {
    alias: {
      'react-router': path.join(__dirname, '..', 'modules')
    }
  },

  // Expose __dirname to allow automatically setting basename.
  context: __dirname,
  node: {
    __dirname: true
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('shared.js'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      '__GITHUB_PAGES_BASE_PATH__': JSON.stringify(process.env.GITHUB_PAGES_BASE_PATH || '')
    })
  ]

}
