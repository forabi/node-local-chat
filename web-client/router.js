const express = require('express');
const webpack = require('webpack');
const webpackdevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.config');
const env = require('../env');

const router = new express.Router;

if (env.isDevelopment) {
  const compiler = webpack(webpackConfig);

  router.use(webpackdevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: true,
  }));

  router.use(webpackHotMiddleware(compiler, {
    log: () => null,
    heartbeat: 10 * 1000,
    reload: true,
  }));
}

router.use('/', express.static(`${__dirname}/public`));

module.exports = router;
