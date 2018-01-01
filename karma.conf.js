var path = require('path');
var webpackConfig = require('./webpack.dev');
var entry = path.resolve(webpackConfig.context, webpackConfig.entry);

webpack = webpackConfig;
webpack.module.rules.push({
    test: /\.js$/,
    loader: "isparta-loader",
    exclude: /(node_modules|test)/ // exclude node_modules and test files
})

module.exports = function(config) {
    config.set({
        autoWatch: false,
        frameworks: ['mocha'],
        files: [
			//Stuff to test.
            {pattern: 'http://code.jquery.com/jquery-2.2.4.min.js', watched: false},
            {pattern: 'https://www.dropbox.com/static/api/2/dropins.js', watched: false},
            {pattern: 'https://cdnjs.cloudflare.com/ajax/libs/strophe.js/1.2.14/strophe.js', watched: false},
            {pattern: 'test/test.js', watched: false},
        ],
        browsers: ['PhantomJS'],
        reporters: ['progress', 'coverage'],
        preprocessors: {
            'test/test.js': ['webpack', 'sourcemap']
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
            'karma-sourcemap-loader'
		],
        singleRun: true,
        webpackMiddleware: {
          stats: 'errors-only'
        },
        webpack: webpack
    });
};
