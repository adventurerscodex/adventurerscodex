'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks
  grunt.initConfig({

	eslint: {
		target: [
    		'charactersheet/charactersheet/*/*.js',
    		'test/*/*.js',
    		'charactersheet/charactersheet/*.js']
	},
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
  grunt.registerTask('default', ['eslint']);
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-karma-coveralls');
};
