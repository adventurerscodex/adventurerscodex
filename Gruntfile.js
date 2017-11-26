'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  grunt.initConfig({

  coveralls: {
    options: {
      coverageDir: 'coverage',
      force: true,
      recursive: true
    }
  }
  });

  grunt.loadNpmTasks('grunt-karma-coveralls');
};
