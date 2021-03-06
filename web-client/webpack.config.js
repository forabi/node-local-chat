const path = require('path');
const webpack = require('webpack');
const babelConfig = require('./babel.client');
const env = require('../env');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('styles.css');

const cssLoaders = ['style', 'css?module=1&localIdentName=[name]_[local]_[hash:base64:5]'];

const config = {
  debug: true,

  devtool: 'source-map',

  entry: {
    bundle: [
      path.resolve(__dirname, 'src/index.js'),
    ],
  },

  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
  },

  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: [
        {
          loader: 'babel',
          query: Object.assign(babelConfig, { cacheDirectory: './tmp' }),
        },
      ],
    }, {
      test: /\.css$/,
      loader: env.isProduction ? extractCSS.extract.apply(extractCSS, cssLoaders) : cssLoaders,
    }, {
      test: /\.svg$/,
      loaders: ['babel', 'react-svg'],
    }, {
      test: /\.(jpg|png)$/,
      loader: 'file',
    }, {
      test: /\.json$/,
      loader: 'json',
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
    extractCSS,
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
  ],
};

if (env.isDevelopment) {
  config.devtool = 'eval';
  config.devServer = {
    inline: true,
  };
  if (env.isHot) {
    config.devServer.hot = true;
    config.entry.bundle.unshift('webpack-hot-middleware/client');
    config.entry.bundle.unshift('react-hot-loader/patch');
    config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
  }
}

if (env.isProduction) {
  config.devtool = false;
  config.debug = false;
  config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin(true));
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false },
  }));
}

module.exports = config;
