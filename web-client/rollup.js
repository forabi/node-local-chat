const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

rollup({
  entry: 'src/index.js',
  plugins: [
    babel(),
    nodeResolve({
      jsnext: true,
      main: true,
    }),
    commonjs({
      include: 'node_modules/**',
    }),
  ],
})
.then(bundle => bundle.write({ dest: 'bundle.js', format: 'iife' }))
.catch(e => console.error(e));
