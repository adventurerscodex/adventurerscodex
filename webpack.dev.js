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
            'ENVIRONMENT': JSON.stringify('dev'),
            'VERSION': JSON.stringify('1.5.1'),
            'CLIENT_ID': JSON.stringify('5vkLTV59I383qojsDTAlgYWuM0uuCfHTf9G0HAeD'),
            'HOST_URL': JSON.stringify('https://app.adventurerscodex.com/charactersheet/'),
            'PUBSUB_HOST_JID': JSON.stringify('pubsub.adventurerscodex.com'),
            'MUC_SERVICE': JSON.stringify('chat.adventurerscodex.com')
        })
    ]
});