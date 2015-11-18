module.exports = function(config) {
    config.set({
        basePath: '', 
        autoWatch: true,
        frameworks: ['mocha'],
        files: [
        	//Frameworks and includes.
		  	{pattern: 'bower_components/mocha/mocha.js', watched: false},
			{pattern: 'bower_components/jquery/dist/jquery.min.js', watched: false},
			{pattern: 'bower_components/bootstrap/dist/js/bootstrap.min.js', watched: false},
			{pattern: 'bower_components/knockout/dist/knockout.js', watched: false},
			{pattern: 'bower_components/file-saver.js/FileSaver.js', watched: false},
			{pattern: 'bower_components/should/should.js', watched: false},
			{pattern: 'bower_components/uri.js/src/URI.min.js', watched: false},
			{pattern: 'bower_components/node-uuid/uuid.js', watched: false},

			{pattern: 'bin/socket.io-1.2.0.js', watched: false},
			{pattern: 'bin/knockout-file-bind.js', watched: false},
			{pattern: 'bin/koExternalTemplateEngine_all.min.js', watched: false},
			//Stuff to test.
			'*/app.js',
			'sheet/app.js',
			'sheet/*/app.js',
			'bin/*.js',
			'sheet/models/*.js',
			//Tests to run.
            'test/*.js'
        ],  
        browsers: ['PhantomJS'],
                            
        reporters: ['progress', 'coverage'],
        preprocessors: { 
        	//'*/app.js': ['coverage'],
        	'sheet/*/app.js': ['coverage'],
        	'sheet/models/*.js': ['coverage'],
        	'test/*.js': ['coverage'],
        	'sheet/app.js': ['coverage']
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
