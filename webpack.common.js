const path = require('path');
const webpack = require('webpack');

let MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
    ],
  },
  plugins: [
    // Injects bundles in your index.html instead of wiring all manually.
    // It also adds hash to all injected assets so we don't have problems
    // with cache purging during deployment.
    new HtmlWebpackPlugin({
        template: 'index.html',
        inject: 'body',
    }),
    new CopyWebpackPlugin({
        patterns: [
            {
                from: 'images/sample-headshots',
                to: 'images/sample-headshots'
            }
        ],
    }),
    new MiniCssExtractPlugin({
        filename: '[name].[chunkhash].css',
//         disable: process.env.BABEL_ENV !== 'production'
    }),
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
        test: /\.css$/i,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    esModule: false,
                },
            },
            "css-loader",
        ],
      },
      {
        // Compress images
        // Credit: https://iamakulov.com/notes/optimize-images-webpack/
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'image-webpack-loader',
        // Specify enforce: 'pre' to apply the loader
        // before url-loader/svg-url-loader
        // and not duplicate it in rules with them
        enforce: 'pre',
        options: {
          disable: false,
        },
        type: 'javascript/auto'
      },
      {
        // inline <10kB images, otherwise treat them like file-loader
        test: /\.(png|jpe?g|gif)$/,
        loader: 'url-loader',
        options: { limit: 10 * 1024 },
      },
      {
        // inline <10kB SVG images, otherwise treat them like file-loader
        test: /\.(svg)$/,
        loader: 'svg-url-loader',
        options: {
          limit: 10 * 1024,
          noquotes: true, // Images will not load if this is disabled
        },
        type: 'javascript/auto'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader",
        options: {
            limit: 10000,
            mimetype: 'application/font-woff'
        },
        type: 'javascript/auto'
      },
      {
        test: /\.(png|jpe?g|gif|ttf|eot)$/,
        type: 'asset/resource'
      }
    ],
  },

  externals: {
    coreapi: 'coreapi',
    schema: 'schema',
    jquery: 'jQuery',
    dropbox: 'Dropbox',
    marked: 'marked',
  }
}
