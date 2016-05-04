const env = require('../env');
const config = {
  presets: ['es2015-webpack', 'stage-3', 'react'],
  plugins: [
    'transform-object-rest-spread',
    'transform-class-properties',
    'transform-function-bind',
    'transform-runtime',
  ],
  sourceMaps: 'both',
};

if (env.isDevelopment && env.isHot) {
  config.plugins.push('react-hot-loader/babel');
  // config.plugins.push(['react-transform', {
  //   transforms: [
  //     {
  //       transform: 'react-transform-hmr',
  //       imports: ['react'],
  //       locals: ['module'],
  //     },
  //     {
  //       transform: 'react-transform-catch-errors',
  //       imports: ['react', 'redbox-react'],
  //     },
  //     {
  //       transform: 'react-transform-render-visualizer',
  //       imports: ['react'],
  //     },
  //   ],
  // }]);
}

if (env.isProduction) {
  [
    'react-optimize',
  ].forEach(p => config.presets.push(p));

  [
    'transform-node-env-inline',
  ].forEach(p => config.plugins.push(p));
  config.sourceMaps = false;
}

module.exports = config;
