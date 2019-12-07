const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const common = require('./webpack.common.js');
const package_ = require('./package.json');

let config = merge(common, {
    mode: 'production',
    // HACKALERT: THIS IS NOT SUITABLE FOR PRODUCTION. DEV SOURCEMAPS HIDE ERRORS
    // AND THIS NEEDS TO BE ADDRESSED BEFORE SHIPPING.
    devtool: 'cheap-module-eval-source-map',
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
        // new CompressionWebpackPlugin(),
        new webpack.DefinePlugin({
            // Some package detect NODE_ENV to determine which build to use
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            },
            /**
             * Application's version number.
             * Used to determine which migration scripts to run.
             */
            'VERSION': JSON.stringify(package_.version),
            /**
             * Date and time the build was created
             */
            'BUILD_DATE': JSON.stringify((new Date()).toLocaleString()),
            /**
             * Current year in yyyy format.
             */
            'CURRENT_YEAR': JSON.stringify((new Date()).getFullYear()),

            // Read from Environment

            /**
             * The string representation of the environment name.
             */
            'ENVIRONMENT': process.env.ENVIRONMENT,
            /**
             * The App's Client ID for the API.
             */
            'CLIENT_ID': process.env.CLIENT_ID,
            /**
             * The URL of the host application.
             */
            'HOST_URL': process.env.HOST_URL,
            /**
             * The URL of the homepage.
             */
            'HOME_URL': process.env.HOME_URL,
            /**
             * The URL of the user's account profile.
             */
            'ACCOUNT_URL': process.env.ACCOUNT_URL,
            /**
             * The URL to the login page.
             */
            'LOGIN_URL': process.env.LOGIN_URL,
            /**
             * The HOST URL of the pubsub services.
             */
            'PUBSUB_HOST_JID': process.env.PUBSUB_HOST_JID,
            /**
             * The MUC Service URL.
             */
            'MUC_SERVICE': process.env.MUC_SERVICE,
            /**
             * The connection URL for the XMPP service.
             */
            'XMPP_WS_URL': process.env.XMPP_WS_URL
        })
    ]
});

if (process.env.ENVIRONMENT == 'test') {
    config = merge(config, {
        devtool: 'cheap-module-eval-source-map'
    });
}

module.exports = config;
