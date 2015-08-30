'use strict';

module.exports = function(grunt) {
  
  grunt.initConfig({

    karma: {
      test: {
        configFile: 'karma.conf.js'
      }
    },
  });

  grunt.loadNpmTasks('grunt-karma');
};
