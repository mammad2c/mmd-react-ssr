/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const WebpackBar = require('webpackbar');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const shell = require('shelljs');
const chokidar = require('chokidar');
const LoadablePlugin = require('@loadable/webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpackUtils = require('./webpack.utils');

const imageRegex = /\.(png|jpe?g|gif|bmp)$/;
const fontRegex = /\.(woff|woff2|ttf|eot|svg|otf|webp)$/;

/**
 * parameters:
 * @param {string} target client || server
 */
const configGenerator = target => {
  const isClient = target === 'client';
  const isProduction = process.env.NODE_ENV === 'production';
  let firstBuildServer = false;

  let entry = ['./src/client.jsx'];

  if (isClient) {
    entry = isProduction
      ? entry
      : [
          'react-hot-loader/patch',
          'webpack-dev-server/client?http://localhost:3001',
          'webpack/hot/only-dev-server',
          ...entry
        ];
  } else {
    entry = ['./src/server.js'];
  }

  let output = {};

  if (isClient) {
    output = {
      path: path.resolve(__dirname, '../build/'),
      filename: `static/js/${
        isProduction ? 'bundle.[hash:8].js' : 'bundle.js'
      }`,
      chunkFilename: `static/js/${
        isProduction ? '[id].[hash:8].chunk.js' : '[id].chunk.js'
      }`,
      publicPath: isProduction ? '/' : 'http://localhost:3001/',
      libraryTarget: 'var'
    };
  } else {
    output = {
      path: path.resolve(__dirname, '../build'),
      publicPath: isProduction ? '/' : 'http://localhost:3001/',
      filename: 'server.js',
      libraryTarget: 'commonjs2'
    };
  }

  let plugins = [
    new webpack.NoEmitOnErrorsPlugin(),
    new WebpackBar({
      name: isClient ? 'client' : 'server',
      color: isClient ? '#2196F3' : '#FFEB3B'
    })
  ];

  if (isClient) {
    plugins = plugins.concat(
      new webpack.NamedModulesPlugin(),
      new LoadablePlugin({
        filename: 'assets.json',
        writeToDisk: true
      }),
      new CopyPlugin([{ from: 'public', to: '' }])
    );

    plugins = plugins.concat(
      isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: 'static/css/[name].[contenthash:8].css',
              chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
              allChunks: true
            })
          ]
        : [
            new webpack.HotModuleReplacementPlugin({
              multiStep: true
            })
          ]
    );
  } else {
    plugins = plugins.concat(
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      }),
      isProduction
        ? []
        : [
            new webpack.HotModuleReplacementPlugin(),
            new webpackUtils.WebpackAfterBuildPlugin(() => {
              let watch;
              if (!firstBuildServer) {
                watch = chokidar.watch('./build/assets.json').on('add', () => {
                  shell.exec('yarn start-dev-server', {
                    async: true
                  });
                  firstBuildServer = true;
                });
              }
              if (firstBuildServer && watch) {
                watch.close();
                watch = undefined;
              }
            })
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
      watchOptions: {
        ignored: /node_modules/
      }
    };
  }

  return {
    name: isClient ? 'client' : 'server',
    mode: isProduction ? 'production' : 'development',
    target: isClient ? 'web' : 'node',
    entry,
    output,
    devtool: isProduction ? false : 'cheap-module-eval-source-map',
    externals: isClient
      ? undefined
      : [
          '@loadable/component',
          nodeExternals({
            whitelist: [
              isProduction ? null : 'webpack/hot/poll?300',
              /\.(eot|woff|woff2|ttf|otf)$/,
              /\.(svg|png|jpg|jpeg|gif|ico)$/,
              /\.(mp4|mp3|ogg|swf|webp)$/,
              /\.(css|scss|sass|sss|less)$/
            ].filter(x => x)
          })
        ],
    module: {
      exprContextCritical: false,
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        },
        {
          test: imageRegex,
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]',
            emitFile: isClient
          }
        },
        {
          test: fontRegex,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
                emitFile: isClient
              }
            }
          ]
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
                    importLoaders: 1
                  }
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: !isProduction,
                    ident: 'postcss'
                  }
                },
                {
                  loader: 'resolve-url-loader'
                },
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: true,
                    sassOptions: {
                      importLoaders: 2,
                      sourceMapContents: false
                    }
                  }
                }
              ]
            }
          : {
              test: /\.(s*)css$/,
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    importLoaders: 1,
                    onlyLocals: true
                  }
                },
                {
                  loader: 'resolve-url-loader'
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    sourceMap: !isProduction,
                    ident: 'postcss'
                  }
                },
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: true,
                    sassOptions: {
                      importLoaders: 2,
                      sourceMapContents: false
                    }
                  }
                }
              ]
            }
      ]
    },
    optimization: isClient
      ? {
          minimize: true,
          splitChunks: {
            chunks: 'all'
          },
          minimizer: [
            new TerserPlugin(webpackUtils.terserPluginOptions),
            new OptimizeCSSAssetsPlugin({
              cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }]
              }
            })
          ]
        }
      : {
          minimizer: [new TerserPlugin(webpackUtils.terserPluginOptions)]
        },
    node: isClient
      ? {
          fs: 'empty',
          net: 'empty'
        }
      : {
          __dirname: false
        },
    resolve: {
      extensions: ['.jsx', '.js'],
      alias: {
        'webpack/hot/poll': require.resolve('webpack/hot/poll'),
        'react-dom': '@hot-loader/react-dom'
      },
      modules: [path.join(__dirname, '../src'), 'node_modules']
    },
    plugins,
    devServer,
    stats: 'errors-only'
  };
};

module.exports = [configGenerator('client'), configGenerator('server')];
