const merge = require('webpack-merge');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            /**
             * The string representation of the environment name.
             */
            'ENVIRONMENT': JSON.stringify('prod'),
            /**
             * Application's version number.
             * Used to determine which migration scripts to run.
             */
            'VERSION': JSON.stringify('1.5.1'),
            /**
             * The App's Client ID for the API.
             */
            'CLIENT_ID': JSON.stringify('5vkLTV59I383qojsDTAlgYWuM0uuCfHTf9G0HAeD'),
            /**
             * The URL of the host application.
             */
            'HOST_URL': JSON.stringify('https://app.adventurerscodex.com/charactersheet/'),
            /**
             * The HOST URL of the pubsub services.
             */
            'PUBSUB_HOST_JID': JSON.stringify('pubsub.adventurerscodex.com'),
            /**
             * The MUC Service URL.
             */
            'MUC_SERVICE': JSON.stringify('chat.adventurerscodex.com')
        })
    ]
});