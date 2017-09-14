var path = require('path');
var webpackConfig = require('./webpack.config');
var entry = path.resolve(webpackConfig.context, webpackConfig.entry);

module.exports = function(config) {
    config.set({
        basePath: '',
        autoWatch: false,
        frameworks: ['mocha'],
        files: [
			//Stuff to test.
            {pattern: 'test/test.js', watched: false}
        ],
        browsers: ['PhantomJS'],
//         reporters: ['progress', 'coverage'],
        preprocessors: {
            entry: ['webpack',],
        	'test/test.js': ['webpack', 'babel'],
		},
        coverageReporter: {
			type: "lcov",
			dir: "coverage/"
		},
		plugins: [
            'karma-babel-preprocessor',
            'karma-coverage',
            'karma-webpack',
            'karma-mocha',
            'karma-phantomjs-launcher',
            'karma-sourcemap-loader',
		],
        singleRun: true,
        webpack: webpackConfig,
        webpackMiddleware: {
          stats: 'errors-only'
        }
    });
};
