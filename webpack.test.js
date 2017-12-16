const package_ = require('./package.json');
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
            /**
             * The string representation of the environment name.
             */
            'ENVIRONMENT': JSON.stringify('test'),
            /**
             * Application's version number.
             * Used to determine which migration scripts to run.
             */
            'VERSION': JSON.stringify(package_.version),
            /**
             * The App's Client ID for the API.
             */
            'CLIENT_ID': JSON.stringify('Sv2vHrQx6z7thqq4E3svVundNM0jMKRP0idNXozn'),
            /**
             * The URL of the host application.
             */
            'HOST_URL': JSON.stringify('https://nightly.adventurerscodex.com/charactersheet/'),
            /**
             * The URL of the homepage.
             */
            'HOME_URL': JSON.stringify('https://nightly.adventurerscodex.com'),
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
            'XMPP_WS_URL': JSON.stringify('wss://nightly.adventurerscodex.com:5280/websocket/'),
            /**
             * Date and time the build was created
             */
            'BUILD_DATE': JSON.stringify((new Date()).toLocaleString())
        })
    ]
});
