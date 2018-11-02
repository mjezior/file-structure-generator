'use strict';
var path = require('path');

module.exports = function makeWebpackConfig() {
  let config = {
    mode: 'development',
  };
  const distDir = '/dist';

  config.entry = {
    bundle: './src/index.js',
  };

  config.node = {
    fs: 'empty'
  };

  config.output = {
    path: __dirname + distDir,
    publicPath: '/',
    filename: '[name].js',
    library: 'bundle',
    libraryTarget: 'umd',
    umdNamedDefine: true
  };

  config.devtool = 'source-map';

  config.module = {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }]
  };

  config.module.rules.push({
    enforce: 'pre',
    test: /\.js$/,
    exclude: [
      /node_modules/,
      /\.spec\.js$/
    ],
    loader: 'istanbul-instrumenter-loader',
    query: {
      esModules: true
    }
  });

  config.plugins = [];

  config.resolve = {
    alias: {
      src: path.resolve('src'),
    }
  };

  config.devServer = {
    contentBase: './src/public',
    hot: true,
    stats: 'minimal',
    host: 'localhost',
    port: '9005'
  };

  return config;
}();