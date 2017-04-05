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
                    '_build/charactersheet/app.js': [
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
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'charactersheet/',
                    src: [
                        '*.html',
                        'bower_components/**/fonts/*',
                        'images/*',
                        'images/**/*',
                        'charactersheet/**/*.html',
                    ],
                    dest: '_build/'
                }],
            },
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'charactersheet/',
                    src: [
                        '*.css',
                        'bower_components/**/*.css',
                        'bin/**/*.css',
                    ],
                    dest: '_build',
                }]
            }
        },
        watch: {
            scripts: {
                files: [
                    'charactersheet/charactersheet/**/*',
                    'charactersheet/charactersheet/*'
                ],
                tasks: ['build'],
                options: {
                    spawn: false,
                    interrupt: true
                },
            },
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-karma-coveralls');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('build', ['uglify', 'cssmin', 'copy']);
};
