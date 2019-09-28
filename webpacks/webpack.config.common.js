const isProduction = process.env.NODE_ENV === 'production';

const imageRegex = /\.(png|jpe?g|gif|bmp)$/;
const fontRegex = /\.(woff|woff2|ttf|eot|svg|otf|webp)$/;

const isWeb = process.env.NODE_TARGET === 'web';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  target: isWeb ? 'web' : 'node',
  devtool: isProduction ? false : 'cheap-module-eval-source-map',
  module: {
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
          name: `${isProduction ? '/' : ''}static/media/[name].[hash:8].[ext]`,
          emitFile: isWeb
        }
      },
      {
        test: fontRegex,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `${
                isProduction ? '/' : ''
              }static/media/[name].[hash:8].[ext]`,
              emitFile: isWeb
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.jsx', '.js']
  },
  stats: 'errors-only'
};
