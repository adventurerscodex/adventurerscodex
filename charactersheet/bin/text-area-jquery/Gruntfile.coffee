module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    clean:
      all: ['dist']
    watch:
      coffee:
        tasks: ['coffee']
        files: ['src/*.coffee']
      html:
        tasks: ['copy']
        files: ['src/index.html']
    coffee:
      main:
        files:
          'dist/jquery.textarea-markdown-editor.js': 'src/jquery.textarea-markdown-editor.coffee'
    copy:
      main:
        files:
          'dist/index.html': 'src/index.html'
          'dist/jquery.js': 'bower_components/jquery/dist/jquery.min.js'
          'dist/marked.min.js': 'bower_components/marked/marked.min.js'
    karma:
      continuous:
        configFile: 'karma.conf.coffee'

  grunt.registerTask 'default', ['clean', 'coffee', 'copy']

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-karma')
