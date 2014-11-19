'use strict';


module.exports = {

  //This is the list of file patterns to load into the browser during testing.
  files: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'lib/*.js',
    'test/*.js'
  ],

  //used framework
  frameworks: ['jasmine'],

  plugins: [
    'karma-chrome-launcher',
    'karma-phantomjs-launcher',
    'karma-mocha-reporter',
    'karma-jasmine',
    'karma-coverage'
  ],

  preprocessors: {
    '**/lib/*.js': 'coverage'
  },

  reporters: ['mocha', 'coverage'],

  coverageReporter: {
    type: 'html',
    dir: 'unit-results/coverage',
    file: 'coverage.html'
  },

  logLevel: 'info',

  urlRoot: '/__test/',

  //used browsers (overriddeng in some gulp task)
  browsers: ['Chrome'],

};
