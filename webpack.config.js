const path = require('path');

module.exports = {
  context: path.resolve(__dirname, './charactersheet/charactersheet'),
  entry: {
    ac: ['./init.js', './settings.js'],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
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
      }
    ]
  }
};