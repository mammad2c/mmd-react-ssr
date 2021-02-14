/* eslint-disable import/no-extraneous-dependencies */
const StartServerPlugin = require('start-server-webpack-plugin');
const path = require('path');
const WebpackBar = require('webpackbar');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const LoadablePlugin = require('@loadable/webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const internalIP = require('internal-ip');
const { WebpackErrors, terserPluginOptions } = require('./webpack.utils');

const imageRegex = /\.(png|jpe?g|gif|bmp)$/;
const fontRegex = /\.(woff|woff2|ttf|eot|svg|otf|webp)$/;
const IP = internalIP.v4.sync();

/**
 * parameters:
 * @param {string} target client || server
 */
const configGenerator = (target) => {
  const isClient = target === 'client';
  const isProduction = process.env.NODE_ENV === 'production';

  let entry = ['./src/client.jsx'];

  if (isClient) {
    entry = isProduction
      ? entry
      : [
          'react-hot-loader/patch',
          `webpack-dev-server/client?http://${IP}:3001`,
          'webpack/hot/only-dev-server',
          ...entry,
        ];
  } else {
    entry = isProduction
      ? ['./src/index.js']
      : ['webpack/hot/poll?300', './src/index.js'];
  }

  let output = {};

  if (isClient) {
    output = {
      path: path.resolve(__dirname, '../build/'),
      filename: `static/js/${
        isProduction ? 'bundle.[chunkhash:8].js' : 'bundle.js'
      }`,
      chunkFilename: `static/js/${
        isProduction ? '[id].[chunkhash:8].chunk.js' : '[id].chunk.js'
      }`,
      publicPath: isProduction ? '/' : `http://${IP}:3001/`,
      libraryTarget: 'var',
    };
  } else {
    output = {
      path: path.resolve(__dirname, '../build'),
      publicPath: isProduction ? '/' : `http://${IP}:3001/`,
      filename: 'server.js',
      libraryTarget: 'commonjs2',
    };
  }

  let plugins = [
    new WebpackErrors(),
    new WebpackBar({
      name: isClient ? 'client' : 'server',
      color: isClient ? '#2196F3' : '#FFEB3B',
    }),
  ];

  plugins = isProduction ? plugins : [...plugins];

  if (isClient) {
    plugins = plugins.concat(
      new LoadablePlugin({
        filename: 'assets.json',
        writeToDisk: true,
      }),
      new CopyPlugin({
        patterns: [{ from: 'public', to: '' }],
      })
    );

    plugins = plugins.concat(
      isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: 'static/css/[name].[contenthash:8].css',
              chunkFilename: 'static/css/[id].[contenthash:8].chunk.css',
              allChunks: true,
            }),
          ]
        : [
            new webpack.HotModuleReplacementPlugin({
              multiStep: true,
            }),
          ]
    );
  } else {
    plugins = plugins.concat(
      isProduction
        ? [
            new webpack.optimize.LimitChunkCountPlugin({
              maxChunks: 1,
            }),
          ]
        : [
            new StartServerPlugin({
              name: 'server.js',
            }),
            new webpack.HotModuleReplacementPlugin(),
          ]
    );
  }

  let devServer;

  if (isClient && !isProduction) {
    devServer = {
      writeToDisk: true,
      disableHostCheck: true,
      clientLogLevel: 'trace',
      compress: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      historyApiFallback: {
        disableDotRule: true,
      },
      host: `${IP}`,
      hot: true,
      quiet: true,
      noInfo: true,
      overlay: true,
      port: 3001,
      watchOptions: {
        ignored: /node_modules/,
      },
    };
  }

  return {
    name: isClient ? 'client' : 'server',
    mode: isProduction ? 'production' : 'development',
    target: isClient ? 'web' : 'node',
    entry,
    output,
    devtool: isProduction ? false : 'eval-cheap-module-source-map',
    externals: isClient
      ? undefined
      : [
          '@loadable/component',
          nodeExternals({
            allowlist: [
              isProduction ? null : 'webpack/hot/poll?300',
              /\.(eot|woff|woff2|ttf|otf)$/,
              /\.(svg|png|jpg|jpeg|gif|ico)$/,
              /\.(mp4|mp3|ogg|swf|webp)$/,
              /\.(css|scss|sass|sss|less)$/,
            ].filter((x) => x),
          }),
        ],
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        },
        {
          test: imageRegex,
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]',
            emitFile: isClient,
          },
        },
        {
          test: fontRegex,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
                emitFile: isClient,
              },
            },
          ],
        },
        isClient
          ? {
              test: /\.(s*)css$/,
              use: [
                isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: !isProduction,
                    importLoaders: 1,
                  },
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: !isProduction,
                  },
                },
                {
                  loader: 'resolve-url-loader',
                },
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: true,
                    sassOptions: {
                      importLoaders: 2,
                      sourceMapContents: false,
                    },
                  },
                },
              ],
            }
          : {
              test: /\.(s*)css$/,
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    importLoaders: 1,
                    modules: {
                      exportOnlyLocals: true,
                    },
                  },
                },
                {
                  loader: 'resolve-url-loader',
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: !isProduction,
                  },
                },
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: true,
                    sassOptions: {
                      importLoaders: 2,
                      sourceMapContents: false,
                    },
                  },
                },
              ],
            },
      ],
    },
    optimization: isClient
      ? {
          minimize: !!isProduction,
          minimizer: isProduction
            ? [
                new TerserPlugin(terserPluginOptions),
                new OptimizeCSSAssetsPlugin({
                  cssProcessorPluginOptions: {
                    preset: [
                      'default',
                      { discardComments: { removeAll: true } },
                    ],
                  },
                }),
              ]
            : [],
        }
      : {
          minimizer: isProduction
            ? [new TerserPlugin(terserPluginOptions)]
            : [],
        },
    node: !isClient && {
      __dirname: false,
    },
    resolve: {
      extensions: ['.jsx', '.js'],
      alias: isProduction
        ? undefined
        : {
            'webpack/hot/poll': require.resolve('webpack/hot/poll'),
            'react-dom': '@hot-loader/react-dom',
          },
      modules: [path.join(__dirname, '../src'), 'node_modules'],
    },
    plugins,
    devServer,
    stats: 'errors-only',
  };
};

module.exports = configGenerator;
