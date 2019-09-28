const path = require('path');
const WebpackBar = require('webpackbar');
const shell = require('shelljs');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const merge = require('webpack-merge');
const webpackUtils = require('./webpack.utils');
const common = require('./webpack.config.common');

let firstBuildClient = false;

const isProduction = process.env.NODE_ENV === 'production';

// configuration
const entry = ['./src/client.jsx'];
const plugins = [
  new webpack.NamedModulesPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new WebpackBar({
    name: 'client'
  }),
  new AssetsPlugin({
    filename: 'assets.json',
    path: './build'
  })
];

module.exports = merge(common, {
  name: 'client',
  entry: isProduction
    ? entry
    : [
        ...entry,
        'webpack-dev-server/client?http://localhost:3001',
        'webpack/hot/only-dev-server'
      ],
  output: {
    path: path.resolve(__dirname, '../build/'),
    filename: `static/js/${isProduction ? 'bundle.[hash:8].js' : 'bundle.js'}`,
    chunkFilename: 'static/js/[id].[hash:8].chunk.js',
    pathinfo: true,
    publicPath: isProduction ? '' : 'http://localhost:3001/'
  },
  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isProduction,
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: !isProduction
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProduction,
              sassOptions: { importLoaders: 2 }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: isProduction
      ? {}
      : {
          'webpack/hot/poll': require.resolve('webpack/hot/poll'),
          'react-dom': '@hot-loader/react-dom'
        }
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  plugins: isProduction
    ? [
        ...plugins,
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[id].[contenthash:8].chunk.css',
          allChunks: true
        })
      ]
    : [
        ...plugins,
        new webpack.HotModuleReplacementPlugin(),
        new webpackUtils.WebpackAfterBuildPlugin(() => {
          if (!firstBuildClient) {
            shell.exec('yarn run dev:server', {
              async: true
            });
            firstBuildClient = true;
          }
        })
      ],
  devServer: isProduction
    ? {}
    : {
        disableHostCheck: true,
        clientLogLevel: 'none',
        compress: true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        historyApiFallback: {
          disableDotRule: true
        },
        host: 'localhost',
        hot: true,
        noInfo: true,
        overlay: true,
        port: 3001,
        quiet: true,
        watchOptions: {
          ignored: /node_modules/
        }
      }
});
