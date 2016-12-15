module.exports = function(config) {
    config.set({
        basePath: '',
        autoWatch: true,
        frameworks: ['mocha'],
        files: [
        	//Frameworks and includes.
		  {pattern: 'charactersheet/bower_components/mocha/mocha.js', watched: false},
			{pattern: 'charactersheet/bower_components/jquery/dist/jquery.min.js', watched: false},
			{pattern: 'charactersheet/bower_components/bootstrap/dist/js/bootstrap.min.js', watched: false},
			{pattern: 'charactersheet/bower_components/knockout/dist/knockout.js', watched: false},
			{pattern: 'charactersheet/bower_components/should/should.js', watched: false},
			{pattern: 'charactersheet/bower_components/uri.js/src/URI.min.js', watched: false},
			{pattern: 'charactersheet/bower_components/node-uuid/uuid.js', watched: false},
			{pattern: 'charactersheet/bower_components/js-signals/dist/signals.min.js', watched: false},
			{pattern: 'charactersheet/bower_components/simple-mock/index.js', watched: false},
			{pattern: 'charactersheet/bower_components/blueimp-md5/js/md5.min.js', watched: false},
			{pattern: 'charactersheet/bin/socket.io-1.2.0.js', watched: false},
			{pattern: 'charactersheet/bin/knockout-file-bind.js', watched: false},
			{pattern: 'charactersheet/bin/koExternalTemplateEngine_all.min.js', watched: false},
			{pattern: 'charactersheet/bin/markdown.min.js', watched: false},
			{pattern: 'charactersheet/bin/knockout.mapping.js', watched: false},
			{pattern: 'charactersheet/bin/knockout-mapping-autoignore.js', watched: false},
			//Stuff to test.
			'charactersheet/charactersheet/**/*root.js',
			'charactersheet/charactersheet/**/*.js',
      'test/**/*.js',
      'test/*.js'
        ],
        browsers: ['PhantomJS'],
        reporters: ['progress', 'coverage'],
        preprocessors: {
        	//'*/app.js': ['coverage'],
        	'charactersheet/charactersheet/**/*.js': ['coverage'],
        	'test/**/*.js': ['coverage'],
        	},
        coverageReporter: {
			type: "lcov",
			dir: "coverage/"
		},
		plugins: [
    		'karma-coverage',
    		'karma-mocha',
    		'karma-phantomjs-launcher'
		],
        singleRun: true
    });
};
