const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.config');
const env = require('../env');

const router = new express.Router;

router.use('/', express.static(`${__dirname}/public`));

if (env.isDevelopment) {
  const compiler = webpack(webpackConfig);

  router.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: false,
  }));

  router.use(webpackHotMiddleware(compiler, {
    log: () => null,
    heartbeat: 10 * 1000,
    reload: true,
  }));
}


module.exports = router;
