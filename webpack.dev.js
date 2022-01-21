const package_ = require('./package.json');
const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');


module.exports = merge(common, {
    mode: 'development',
    // As per-recommended on:
    // https://github.com/webpack/webpack/issues/4363
    // devtool: 'cheap-module-eval-source-map',
    devtool: 'cheap-module-source-map',
    devServer: {
//         contentBase: './dist',
        port: 3000
    },
    plugins: [
        new webpack.DefinePlugin({
            /**
             * The string representation of the environment name.
             */
            'ENVIRONMENT': JSON.stringify('dev'),
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
            'HOME_URL': JSON.stringify('/'),
            /**
             * The URL of the user's account profile.
             */
            'ACCOUNT_URL': JSON.stringify('/accounts/profile/'),
            /**
             * The URL to the login page.
             */
            'LOGIN_URL': JSON.stringify('/api/o/authorize?client_id={CLIENT_ID}&response_type=token'),
            /**
             * The URL of the Web-Socket Server
             */
            'WS_URL': JSON.stringify('ws://localhost:5050/api/live'),
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
