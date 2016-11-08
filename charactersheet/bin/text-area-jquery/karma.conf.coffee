module.exports = (config) ->
  config.set
    basePath: ''
    frameworks: ['mocha', 'expect', 'sinon']
    files: [
      'bower_components/jquery/dist/jquery.min.js'
      'dist/jquery.textarea-markdown-editor.js'
      'dist/index.html'
      'spec/spec_helper.coffee'
      'spec/**/*.coffee'
    ]

    exclude: []

    preprocessors:
      '**/*.coffee': ['coffee']

    coffeePreprocessor:
      options:
        bare: true,
        sourceMap: false
      transformPath: (path) ->
        path.replace(/\.js$/, '.coffee')

    reporters: ['progress']

    port: 9876

    colors: true

    logLevel: config.LOG_INFO

    autoWatch: false

    browsers: ['PhantomJS']

    singleRun: true
