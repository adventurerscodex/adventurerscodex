const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'ENVIRONMENT': JSON.stringify('test'),
            'VERSION': JSON.stringify('1.5.1'),
            'CLIENT_ID': JSON.stringify('5vkLTV59I383qojsDTAlgYWuM0uuCfHTf9G0HAeD'),
            'HOST_URL': JSON.stringify('https://app.adventurerscodex.com/charactersheet/'),
            'PUBSUB_HOST_JID': JSON.stringify('pubsub.adventurerscodex.com'),
            'MUC_SERVICE': JSON.stringify('chat.adventurerscodex.com')
        })
    ]
});