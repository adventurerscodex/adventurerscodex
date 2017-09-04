const path = require('path');
const webpack = require('webpack');

module.exports = {
//   context: path.resolve(__dirname, './charactersheet'),
  entry: {
    ac: './charactersheet/app.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
  resolve: {
    modules: [
        path.resolve('./charactersheet'),
        path.resolve('./node_modules')
    ]
  },
  plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function isExternal(module) {
        var context = module.context;
        if (typeof context !== 'string') {
            return false;
        }
        return context.indexOf('node_modules') !== -1;
        }
      })
  ],
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':data-src']
          }
        }
      },
      {  // for loading in css files
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      { // for loading in images
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      { // for loading tests
      test: /test\.js$/,
      use: 'mocha-loader',
      exclude: /node_modules/,
      }
    ],
  },
  externals: {
    jquery: 'jQuery',
    dropbox: 'dropbox',
    marked: 'marked',
  }
}
