'use strict';

var config = require('./build.config.js');
var karmaConfig = require('./karma.config.js');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pkg = require('./package');
var karma = require('karma').server;
var _ = require('lodash');


// run unit tests with travis CI
gulp.task('travis', function(cb) {
  karma.start(_.assign({}, karmaConfig, {
    singleRun: true,
    browsers: ['PhantomJS']
  }), cb);
});

//generate css files from scss sources
gulp.task('sass', function() {
  return gulp.src(config.scss)
    .pipe($.header(config.banner, {
      pkg: pkg
    }))
    .pipe($.sass())
    .on('error', function(err) {
      console.log(err.message);
    })
    .pipe(gulp.dest(config.dist))
    .pipe($.csso())
    .pipe($.header(config.banner, {
      pkg: pkg
    }))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(config.dist));
});

//generate js files
gulp.task('js', function() {
  return gulp.src(config.js)
    .pipe($.header(config.banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest(config.dist))
    .pipe($.uglify())
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.header(config.banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest(config.dist));
});

//build files
gulp.task('build', function(cb) {
  runSequence(['sass', 'js'], cb);
});

//lint files
gulp.task('jshint', function() {
  return gulp.src(config.js)
    .pipe($.jshint()).on('error', function(err){
      console.log(err);
    })
    .pipe($.jshint.reporter('jshint-stylish'));
});

/* tasks supposed to be public */

//default task
gulp.task('default', ['serve']); //

//run unit tests and exit
gulp.task('test', function(cb) {
  karma.start(_.assign({}, karmaConfig, {
    singleRun: true
  }), cb);
});

//run the server after having built generated files, and watch for changes
gulp.task('serve', function() {
  browserSync({
    logLevel: 'silent',
    notify: false,
    server: ['example', '.']
  });

  gulp.watch(config.scss, ['sass']);
  gulp.watch(config.js, ['jshint', 'js']);
});

gulp.task('bump', function() {
  gulp.src(['./bower.json', './package.json'])
    .pipe($.bump())
    .pipe(gulp.dest('.'));
});
