const path = require('path');
const webpack = require('webpack');
const babelConfig = require('./babel.client');
const env = require('../env');

const config = {
  debug: true,

  devtool: 'source-map',

  entry: {
    bundle: [path.resolve(__dirname, 'src/index.js')],
  },

  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
  },

  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: Object.assign(babelConfig, { cacheDirectory: './tmp' }),
    }],
  },

  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      },
      isBrowser: true,
    }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
  ],
};

if (env.isDevelopment) {
  config.devtool = 'eval';
  if (env.isHot) {
    config.entry.bundle.unshift('webpack-hot-middleware/client');
    config.output.publicPath = 'http://localhost:8080/';
    config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
  }
}

if (env.isProduction) {
  config.devtool = false;
  config.debug = false;
  config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false },
  }));
}

module.exports = config;
