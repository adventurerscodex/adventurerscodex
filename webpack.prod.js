const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const common = require('./webpack.common.js');
const package_ = require('./package.json');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'hidden-source-map',
    output: {
        filename: '[name].[chunkhash].js'
    },
    optimization: {
        minimize: true,
        splitChunks: {
            chunks: 'all'
        }
    },
    resolve: {
        alias: {
            // Use minified versions of dependencies that don't automatically do this
            knockout$: 'knockout/build/output/knockout-latest.js', // Will do this in 3.5
            toastr$: 'toastr/build/toastr.min.js',
            'jquery-validation$': 'jquery-validation/dist/jquery.validate.min.js'
        }
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new CompressionWebpackPlugin(),
        new webpack.DefinePlugin({
            // Some package detect NODE_ENV to determine which build to use
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            },
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
             * The URL to the login page.
             */
            'LOGIN_URL': JSON.stringify('/api/o/authorize?client_id={CLIENT_ID}&response_type=token'),
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
            'XMPP_WS_URL': JSON.stringify('wss://adventurerscodex.com/chat/'),
            /**
             * Date and time the build was created
             */
            'BUILD_DATE': JSON.stringify((new Date()).toLocaleString()),
            /**
             * Current year in yyyy format.
             */
            'CURRENT_YEAR': JSON.stringify(new Date().getFullYear())
        })
    ]
});
