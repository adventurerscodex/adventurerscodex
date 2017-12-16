const package_ = require('./package.json');
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
            'VERSION': JSON.stringify(package_.version),
            /**
             * The App's Client ID for the API.
             */
            'CLIENT_ID': JSON.stringify('5vkLTV59I383qojsDTAlgYWuM0uuCfHTf9G0HAeD'),
            /**
             * The URL of the host application.
             */
            'HOST_URL': JSON.stringify('https://app.adventurerscodex.com/charactersheet/'),
            /**
             * The URL of the homepage.
             */
            'HOME_URL': JSON.stringify('https://app.adventurerscodex.com'),
            /**
             * The HOST URL of the pubsub services.
             */
            'PUBSUB_HOST_JID': JSON.stringify('pubsub.adventurerscodex.com'),
            /**
             * The MUC Service URL.
             */
            'MUC_SERVICE': JSON.stringify('chat.adventurerscodex.com'),
            /**
             * The connection URL for the XMPP service.
             */
            'XMPP_WS_URL': JSON.stringify('wss://adventurerscodex.com:5280/websocket/'),
            /**
             * Date and time the build was created
             */
            'BUILD_DATE': JSON.stringify((new Date()).toLocaleString())
        })
    ]
});
