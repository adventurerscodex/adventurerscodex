var path = require('path');
var webpackConfig = require('./webpack.dev');
var entry = path.resolve(webpackConfig.context, webpackConfig.entry);

webpack = webpackConfig;
webpack.module.rules.push({
    test: /\.js$/,
    loader: "isparta-loader",
    exclude: /(node_modules)/ // exclude node_modules and test files
})

// Replace the production source map settings with a much faster version.
delete webpackConfig.entry
webpackConfig.devtool = 'cheap-inline-source-map'

module.exports = function(config) {
    config.set({
        autoWatch: false,
        frameworks: ['mocha'],
        files: [
			//Stuff to test.
            {pattern: 'http://code.jquery.com/jquery-2.2.4.min.js', watched: false},
            {pattern: 'https://www.dropbox.com/static/api/2/dropins.js', watched: false},
            {pattern: 'https://cdnjs.cloudflare.com/ajax/libs/strophe.js/1.2.14/strophe.js', watched: false},
            {pattern: 'test/setup.js', watched: false},
            {pattern: 'test/test.js', watched: false},
        ],
        browsers: ['PhantomJS'],
        reporters: ['mocha', 'coverage'],
        preprocessors: {
            'test/test.js': ['webpack'],
        },
        coverageReporter: {
            reporters: [
                { type: "lcov", dir: "coverage/" },
                { type: 'text-summary' }
            ]
        },
		plugins: [
            'karma-coverage',
            'karma-webpack',
            'karma-mocha',
            'karma-phantomjs-launcher',
            'karma-mocha-reporter',
		],
        singleRun: true,
        webpackMiddleware: {
          stats: 'errors-only'
        },
        webpack: webpack
    });
};
