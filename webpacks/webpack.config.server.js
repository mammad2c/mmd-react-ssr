const path = require('path');
const nodeExternals = require('webpack-node-externals');
const WebpackBar = require('webpackbar');
const shell = require('shelljs');
const webpack = require('webpack');
const TerserJSPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.config.common');
const webpackUtils = require('./webpack.utils');

let firstBuildServer = false;

const isProduction = process.env.NODE_ENV === 'production';

// configuration
const entry = ['./src/server.jsx'];
const plugins = [
  new webpack.NamedModulesPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new WebpackBar({
    name: 'server'
  })
];

module.exports = merge(common, {
  name: 'server',
  entry: isProduction ? entry : [...entry, 'webpack/hot/poll?1000'],
  externals: [
    nodeExternals({
      whitelist: [!isProduction && 'webpack/hot/poll?1000']
    })
  ],
  output: {
    path: path.resolve(__dirname, '../build'),
    publicPath: isProduction ? '' : 'http://localhost:3001/',
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  node: {
    __dirname: false
  },
  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: { importLoaders: 2 }
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [new TerserJSPlugin({})]
  },
  plugins: isProduction
    ? plugins
    : [
        ...plugins,
        new webpack.HotModuleReplacementPlugin(),
        new webpackUtils.WebpackAfterBuildPlugin(() => {
          if (!firstBuildServer) {
            shell.exec('yarn start-dev-server', {
              async: true
            });
            firstBuildServer = true;
          }
        })
      ]
});
