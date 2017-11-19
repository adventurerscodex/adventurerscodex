const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');
let CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        port: 3000
    },
    plugins: [
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: false
        }),
        new webpack.DefinePlugin({
            'DEVELOPMENT': JSON.stringify(true)
        })
    ]
});