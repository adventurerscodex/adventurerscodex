'use strict';

module.exports = function(grunt) {
  
  grunt.initConfig({

    karma: {
      test: {
        configFile: 'karma.conf.js'
      }
    },
	coveralls: {
		options: {
			coverageDir: 'coverage',
			force: true,
			recursive: true
		}
	}
  });
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-karma-coveralls');
};
