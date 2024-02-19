const path = require('path');
const webpack = require('webpack');

let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: './app.js' ,
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
  resolve: {
    modules: [
        path.resolve('./src'),
        path.resolve('./node_modules')
    ]
  },
  plugins: [
    // Injects bundles in your index.html instead of wiring all manually.
    // It also adds hash to all injected assets so we don't have problems
    // with cache purging during deployment.
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'body',
      hash: true
    }),
    new CopyWebpackPlugin([
        {
            from: 'images/sample-headshots',
            to: 'images/sample-headshots'
        }
    ]),
    new ExtractTextWebpackPlugin({
      filename: '[name].[chunkhash].css',
      disable: process.env.BABEL_ENV !== 'production'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
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
        use: ExtractTextWebpackPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: { minimize: process.env.BABEL_ENV === 'production' }
            }
          ],
          fallback: 'style-loader'
        })
      },
      {
        // Compress images
        // Credit: https://iamakulov.com/notes/optimize-images-webpack/
        test: /\.(jpg|png|gif|svg)$/,
        loader: 'image-webpack-loader',
        // Specify enforce: 'pre' to apply the loader
        // before url-loader/svg-url-loader
        // and not duplicate it in rules with them
        enforce: 'pre',
        options: {
          bypassOnDebug: true
        }
      },
      {
        // inline <10kB images, otherwise treat them like file-loader
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        options: { limit: 10 * 1024 }
      },
      {
        // inline <10kB SVG images, otherwise treat them like file-loader
        test: /\.(svg)$/,
        loader: 'svg-url-loader',
        options: {
          limit: 10 * 1024,
          noquotes: true // Images will not load if this is disabled
        }
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      },
    ],
  },
  externals: {
    coreapi: 'coreapi',
    schema: 'schema',
    jquery: 'jQuery',
    marked: 'marked',
  }
}
