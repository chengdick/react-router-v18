/*eslint-disable no-var */

var fs = require('fs')
var path = require('path')
var webpack = require('webpack')

module.exports = {

  devtool: 'inline-source-map',

  entry: fs.readdirSync(__dirname).reduce(function (entries, dir) {
    // 排除 __build__ 目录和其他非示例目录
    if (dir === '__build__' || dir.startsWith('.')) {
      return entries
    }
    var dirPath = path.join(__dirname, dir)
    if (fs.statSync(dirPath).isDirectory()) {
      var appJsPath = path.join(dirPath, 'app.js')
      if (fs.existsSync(appJsPath)) {
        entries[dir] = appJsPath
      }
    }
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
