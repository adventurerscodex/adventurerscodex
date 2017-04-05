'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    grunt.initConfig({

        eslint: {
            target: [
                'charactersheet/charactersheet/*/*.js',
                'test/*/*.js',
                'charactersheet/charactersheet/*.js',
                'charactersheet/charactersheet/*/*/*.js',
                'charactersheet/charactersheet/*/*/*/*.js',
                'charactersheet/charactersheet/*/*/*/*/*.js']
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
        },
        uglify: {
            options: {
                sourceMap: true,
            },
            deploy: {
                files: {
                    'charactersheet/charactersheet/app.js': [
                        'charactersheet/bower_components/Strophe.js/strophe.js',
                        'charactersheet/bower_components/jquery/dist/jquery.min.js',
                        'charactersheet/bower_components/jquery-ui/jquery-ui.min.js',
                        'charactersheet/bower_components/bootstrap/dist/js/bootstrap.min.js',
                        'charactersheet/bower_components/knockout/dist/knockout.js',
                        'charactersheet/bower_components/bower-knockout-mapping/dist/knockout.mapping.min.js',
                        'charactersheet/bower_components/file-saver.js/FileSaver.js',
                        'charactersheet/bower_components/node-uuid/uuid.js',
                        'charactersheet/bower_components/js-signals/dist/signals.min.js',
                        'charactersheet/bower_components/knockout-file-bindings/knockout-file-bindings.js',
                        'charactersheet/bower_components/blueimp-md5/js/md5.min.js',
                        'charactersheet/bower_components/select2/select2.min.js',
                        'charactersheet/bower_components/toastr/toastr.min.js',
                        'charactersheet/bower_components/jquery.textarea-markdown-editor/dist/marked.min.js',
                        'charactersheet/bower_components/jquery.textarea-markdown-editor/dist/jquery.textarea-markdown-editor.js',
                        'charactersheet/bin/*.js',
                        'charactersheet/bin/**/*.js',
                        'charactersheet/charactersheet/**/*.js',
                    ],
                }
            }
        },
        watch: {
            scripts: {
                files: [
                    'charactersheet/charactersheet/**/*.js',
                    'charactersheet/charactersheet/*.js'
                ],
                tasks: ['uglify'],
                options: {
                    spawn: false,
                    interrupt: true
                },
            },
        }
    });

    grunt.registerTask('default', ['eslint']);
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-karma-coveralls');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
