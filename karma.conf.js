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
			{pattern: 'bin/knockout-file-bind.js', watched: false},
			{pattern: 'bin/koExternalTemplateEngine_all.min.js', watched: false},
			//Stuff to test.
			'app.js',
			'*/app.js',
			//Tests to run.
            'test/*.js'
        ],  
        browsers: ['IE', 'Firefox', 'Chrome', 'PhantomJS'],
                            
        reporters: ['progress', 'coverage'],
        preprocessors: { 
        	'*.js': ['coverage'],
        	'*/app.js': ['coverage']
        	},
                                    
        singleRun: true
    }); 
};
